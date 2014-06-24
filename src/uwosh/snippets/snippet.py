from five import grok
from plone.directives import dexterity, form

from zope import schema
from zope.schema.interfaces import IContextSourceBinder
from zope.schema.vocabulary import SimpleVocabulary, SimpleTerm

from zope.interface import invariant, Invalid

from z3c.form import group, field

from plone.namedfile.interfaces import IImageScaleTraversable
from plone.namedfile.field import NamedImage, NamedFile
from plone.namedfile.field import NamedBlobImage, NamedBlobFile

from plone.app.z3cform.wysiwyg import WysiwygFieldWidget
from plone.autoform.directives import widget

from plone.app.textfield import RichText

from uwosh.snippets import MessageFactory as _
import re


# Interface class; used to define content-type schema.

class ISnippet(form.Schema):
    """
    A snippet definition
    """
    form.mode(id="hidden")
    id=schema.TextLine(title=u"Hidden ID Field", required=False)

    form.widget(text=WysiwygFieldWidget)
    text = schema.Text(
            title=_(u"Snippet content"),
        )


# Custom content-type class; objects created for this content type will
# be instances of this class. Use this class to add content-type specific
# methods and properties. Put methods that are mainly useful for rendering
# in separate view classes.

class Snippet(dexterity.Item):
    grok.implements(ISnippet)
    grok.name('snippet')

    # Add your class methods and properties here
    def getDescription(self):
        return self.description

    def getText(self):
        return self.text

    def getTitle(self):
        return self.title

    def getWorkflowState(self):
        return self.state

    def setDescription(self, description):
        self.description = description

    def setId(self, snippetId):
        self.id = snippetId

    def setText(self, snippetText):
        self.text = snippetText

    def setTitle(self, snippetTitle):
        self.title = snippetTitle

    def setWorkflowState(self, state):
        self.state = state



# View class
# The view will automatically use a similarly named template in
# snippet_templates.
# Template filenames should be all lower case.
# The view will render when you request a content object with this
# interface with "/@@sampleview" appended.
# You may make this the default view for content objects
# of this type by uncommenting the grok.name line below or by
# changing the view class name and template filename to View / view.pt.

class Overlay(dexterity.EditForm):
    grok.context(ISnippet)
    grok.require('zope2.View')
    grok.name('overlay')

    template = grok.PageTemplateFile('snippet_templates/overlay.pt')
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
import re, z3c


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

class Snippet(dexterity.Item):
    grok.implements(ISnippet)
    grok.name('snippet')

class SnippetAddForm(dexterity.AddForm):
    grok.name('uwosh.snippets.Snippet')
    form.wrap(False)
    template = grok.PageTemplateFile('snippet_templates/overlay.pt')

class Edit_overlay(dexterity.EditForm):
    grok.context(ISnippet)
    grok.require('zope2.View')
    grok.name('edit-snippet')

    template = grok.PageTemplateFile('snippet_templates/overlay.pt')
from plone.directives.form import SchemaAddForm, SchemaEditForm
from plone.autoform.form import AutoExtensibleForm
from Products.statusmessages.interfaces import IStatusMessage
from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile

from uwosh.snippets.snippet import ISnippet
from uwosh.snippets.snippetmanager import SnippetManager

from z3c.form.interfaces import ActionExecutionError
from zope.interface import Invalid

import re
import zope
import z3c

_ = zope.i18nmessageid.MessageFactory(u'uwosh.snippets')


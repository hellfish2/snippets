from plone.app.testing import TEST_USER_NAME, PLONE_FIXTURE, login, \
    IntegrationTesting, PloneSandboxLayer, applyProfile, setRoles, \
    TEST_USER_ID, TEST_USER_PASSWORD


from plone.app.testing import PloneSandboxLayer
from plone.app.testing import applyProfile
from plone.app.testing import PLONE_FIXTURE
from plone.app.testing import IntegrationTesting
from plone.app.testing import FunctionalTesting

from Products.CMFCore.utils import getToolByName
from plone.dexterity.utils import createContentInContainer
from zope.publisher.browser import TestRequest

from Products.Five.browser import BrowserView as View

import unittest2 as unittest

from plone.testing import z2

from zope.configuration import xmlconfig

from uwosh.snippets.parser import SnippetParser
from uwosh.snippets.snippetmanager import SnippetManager
from uwosh.snippets.snippet import ISnippet
from uwosh.snippets.browser.snippetlist import SnippetList


class UwoshsnippetsLayer(PloneSandboxLayer):

    defaultBases = (PLONE_FIXTURE,)

    def setUpZope(self, app, configurationContext):
        # Load ZCML
        import uwosh.snippets
        xmlconfig.file(
            'configure.zcml',
            uwosh.snippets,
            context=configurationContext
        )

        # Install products that use an old-style initialize() function
        #z2.installProduct(app, 'Products.PloneFormGen')

#    def tearDownZope(self, app):
#        # Uninstall products installed above
#        z2.uninstallProduct(app, 'Products.PloneFormGen')

    def setUpPloneSite(self, portal):
        applyProfile(portal, 'uwosh.snippets:default')
        setRoles(portal, TEST_USER_ID, ['Manager'])

UWOSH_SNIPPETS_FIXTURE = UwoshsnippetsLayer()
UWOSH_SNIPPETS_INTEGRATION_TESTING = IntegrationTesting(
    bases=(UWOSH_SNIPPETS_FIXTURE,),
    name="UwoshsnippetsLayer:Integration"
)
UWOSH_SNIPPETS_FUNCTIONAL_TESTING = FunctionalTesting(
    bases=(UWOSH_SNIPPETS_FIXTURE, z2.ZSERVER_FIXTURE),
    name="UwoshsnippetsLayer:Functional"
)


class BaseTest(unittest.TestCase):

    def setUp(self):
        portal = self.layer['portal']
        app = self.layer['app']

        if not portal['.snippets']:
            portal.invokeFactory('Folder', '.snippets')

        folder = portal['.snippets']
        self.folder = folder
        self.doc = createContentInContainer(self.folder, 'uwosh.snippets.Snippet', title = 'testDoc')

        folder.invokeFactory('Folder', 'testFolder')
        folder2 = folder['testFolder']
        self.doc2 = createContentInContainer(folder2, 'uwosh.snippets.Snippet', title = 'testDoc2')

        #need to verify that the regex will catch more than 1
        self.testString = 'This is a <span data-type="snippet_tag" data-snippet-id="testdoc"></span> test! Or is it <span data-type="snippet_tag" data-snippet-id="testdoc"></span>?'

        self.doc.text = "meaningless"
        self.doc.title = "Meaningless" 

        wft = getToolByName(portal, 'portal_workflow')
        wft.setDefaultChain('simple_publication_workflow')

    def getRequest(self, form={}):
        request = TestRequest(form=form, environ={
            'SERVER_URL': 'http://nohost/plone/@@get-snippet-list',
            'HTTP_HOST': 'nohost'
            })

        return request

    def tearDown(self):
        portal = self.layer['portal']

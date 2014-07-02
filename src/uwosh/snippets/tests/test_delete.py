from uwosh.snippets.browser.deletesnippet import DeleteSnippet
from uwosh.snippets.snippet import Snippet
import unittest2 as unittest
from uwosh.snippets.testing import BaseTest
from uwosh.snippets.testing import \
    UWOSH_SNIPPETS_INTEGRATION_TESTING

from plone.app.testing import setRoles, login, TEST_USER_NAME

class TestDelete(BaseTest):

	layer = UWOSH_SNIPPETS_INTEGRATION_TESTING

	def test_delete_normal(self):
		dl = DeleteSnippet(self.doc, self.getRequest({'snippet-id': 'testdoc'}))

		self.assertTrue( 'testdoc' in self.layer['portal']['.snippets'] )

		self.assertTrue( dl() )

		self.assertFalse( 'testdoc' in self.layer['portal']['.snippets'] )

	def test_delete_bad(self):
		dl = DeleteSnippet(self.doc, self.getRequest({'snippet-id': 'fakedoc'}))

		self.assertFalse( dl() )


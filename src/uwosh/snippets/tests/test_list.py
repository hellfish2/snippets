from uwosh.snippets.browser.snippetlist import SnippetList
import unittest2 as unittest
from uwosh.snippets.testing import BaseTest
from uwosh.snippets.testing import \
    UWOSH_SNIPPETS_INTEGRATION_TESTING

from plone.app.testing import setRoles, login, TEST_USER_NAME

class TestList(BaseTest):

	layer = UWOSH_SNIPPETS_INTEGRATION_TESTING

	def test_list_normal(self):
		sl = SnippetList(self.doc, self.getRequest())
		res = sl()
		self.assertTrue('testdoc</div>' in res)
		self.assertTrue('testdoc2</div>' in res)

		index1 = res.index('testdoc</div>')
		index2 = res.index('testdoc2</div>')
		self.assertNotEqual(index1, index2)

	def test_browser(self):
		sl = SnippetList(self.doc, self.getRequest({'list-view': 'true'}))
		res = sl()

		self.assertTrue('id="snippet-browser-select"' in res)
		self.assertTrue('value="testdoc2"' in res)
		self.assertTrue('value="testdoc"' in res)

	def test_json_good(self):
		sl = SnippetList(self.doc, self.getRequest({'json': 'true', 'snippet_id': 'testdoc'}))
		res = sl()
		
		import json
		out = json.loads(res)

		self.assertTrue( isinstance(out, dict) )

		self.assertEqual( self.doc.text, out['text'] )
		self.assertEqual( self.doc.title, out['title'] )
		self.assertEqual( self.doc.description, out['description'] )
		self.assertEqual( self.doc.id, out['id'] )

	def test_json_bad(self):
		sl = SnippetList(self.doc, self.getRequest({'json':'true','snippet_id':'fake'}))
		res = sl()

		self.assertEqual(res, 'false')

		#We don't want it sending back anything remotely usable
		import json
		self.assertRaises(TypeError, json.loads(res))






from Products.Five.browser import BrowserView
from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile
from uwosh.snippets.snippetmanager import SnippetManager
from Products.CMFCore.utils import getToolByName
import json
import urllib

class SnippetList(BrowserView):
	window_template = ViewPageTemplateFile('templates/snippet-window.pt')
	browser_template = ViewPageTemplateFile('templates/snippet-browser.pt')

	def __call__(self):

		if self.request.get('list-view'):
			return self.browser_template()
		elif self.request.get('json'):
			if self.request.get('snippet_id'):
				self.request.response.setHeader('Content-Type', 'application/JSON;;charset="utf-8"') 
				sm = SnippetManager()
				snippetId = self.request.get('snippet_id')
				snippetId = urllib.unquote(snippetId)
				try:
					snippet = sm.getSnippet(snippetId)
					
					#Eventually I would prefer a more flexible option for this...
					snippetProps = {
						'id': snippet.id,
						'title': snippet.title,
						'description': snippet.description,
						'text': snippet.text
					}
				except KeyError:
					#Getting here means the request snippetID doesn't exist
					#Returning False tells the AJAX handler to remove the snippet tag
					return json.dumps(False)

				return json.dumps(snippetProps)
		else:
			return self.window_template()

	def getSnippets(self):
		sm = SnippetManager()

		snippets = sm.getSnippets()
		out = []
		for snippet in snippets:
			out.append(snippet)

		return out

	def getSnippetAsJSON(self, snippet):
		return json.dumps(snippet, default=lambda o: o.__dict__, sort_keys=True, indent=4)

	def siteUrl(self):
		portal_url = getToolByName(self.context, "portal_url")
		portal = portal_url.getPortalObject()
		return portal.absolute_url()

	def render(self):
		"""
		Breaking things, because I can
		"""
		return 
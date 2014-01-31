$(document).ready(function() {

	document.title = 'Add a snippet';
	var t = $(this);

	$('#snippet-insert').click(function() {
		var snippet = $('#snippet-selection').val();
		if( snippet != "None" )
		{
			tinyMCEPopup.editor.selection.setContent('!{{id=' + snippet + '}}!', {format: 'raw'});
			tinyMCEPopup.close();
		}
		else if( snippet == undefined )
		{
			tinyMCEPopup.editor.windowManager.alert('You must select a snippet before saving.');
			$('#snippet-select').focus();
		}
	});

	$('#snippet-cancel').click(function() {

		tinyMCEPopup.close();
	});

	$('#snippet-view').click(function() {
		var body = tinyMCEPopup.editor.getDoc().body;
		$('#snippet-preview').html($(body).clone());
		$('#snippet-normal-buttons').hide();
		$('#snippet-preview-buttons').show();
	});

	$('#snippet-preview-cancel').click(function() {
		$('#snippet-normal-buttons').show();
		$('#snippet-preview-buttons').hide();
		$('#snippet-preview').html(getSelectedSnippet().html());
	});

	$('#snippet-select').click(function() {
		var url = tinyMCEPopup.getWindowArg('current_url');
		var ed = tinyMCE.activeEditor;
		ed.windowManager.open({
			file: url + '/@@get-snippet-list?list-view=true',
			width : 800,
          	height : 600,
          	inline : 1

		}, {
			t: t,
		});
	});

	$('#snippet-preview-insert').click(function() {
		if( $('#snippet-select').find('option:selected').val() != "None" )
		{
			var text = getSelectedSnippet();
			var id = $(text).parent().find('.snippet-id').text();

			text = $(text).clone();

			//we wrap the snippet in a span that lets us work with it easier
			//when we go to "save" the preview
			$(text).wrap('<span class="snippet-wrapper" snippet-id="' + id + '"></span>');
			text = $(text).parent();

			//grabs the actual DOM element.
			text = $(text).get(0);

			var preview = $('#snippet-preview').get(0);

			var sel = window.getSelection();
			range = sel.getRangeAt(0);

			//makes sure the user selection is inside the 
			//preview window. Otherwise, the user could replace
			//text anywhere on the window.
			if( range.intersectsNode(preview) )
			{
				sel.deleteFromDocument();
				range.insertNode(text);
			}
			else
			{
				tinyMCEPopup.editor.windowManager.alert('You must select select a location to insert the snippet.');
			}
		}
		else
		{
			tinyMCEPopup.editor.windowManager.alert("You must select a snippet to insert.");
			$('#snippet-select').focus();
		}
	});

	$('#snippet-preview-save').click(function() {

		var snippets = $('.snippet-wrapper');
		$(snippets).each(function() {
			var name = $(this).attr('snippet-id');

			$(this).replaceWith('!{{id=' + name + '}}!');
		});

		var body = $('#snippet-preview').html();
		tinyMCEPopup.editor.setContent(body);

		tinyMCEPopup.close();
	});

	function getSelectedSnippet() {
		var selected = $('#snippet-selection').val();
		var id = '#snippet-' + selected;

		return $(id).find('.snippet-text');
	}
});
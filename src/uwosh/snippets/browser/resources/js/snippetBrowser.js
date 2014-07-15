$(document).ready(function() {

	var t = tinyMCEPopup.getWindowArg('t');
	var setSelected = tinyMCEPopup.getWindowArg('setSelected');
	var reload = tinyMCEPopup.getWindowArg('reload');
	var selectedSnippet = $(t).find('#snippet-selection');
	var lastURL;

	catchEdit();

	buildLayout();

	fillEmptyFolders();

	if( selectedSnippet.val() != "" )
	{
		var selected = $(':radio[value="' + selectedSnippet.val() + '"]');
		$(selected).attr('checked', true);
		$(selected).addClass('highlight');
	}

	$('#snippet-browser-cancel').click(function() {
		tinyMCEPopup.close();
	});

	$('#snippet-browser-select').click(function() {

		var selected = $('input[name="snippet"]:checked').val();

		if( selected == undefined )
		{
			tinyMCEPopup.editor.windowManager.alert('You much choose a snippet to select.');
		}
		else
		{
			selected = sanitize(selected);

			var id = "#snippet-" + selected;
			setPreviewWindow(selected);
			tinyMCEPopup.close();
		}
	});

	$('.snippet-box').click(function() {

		$('.snippet-box').removeClass('highlight');
		$(this).find('input').attr('checked', true);
		$(this).addClass('highlight');
	});

	$('.snippet-box').mouseenter(function() {
		$(this).addClass('highlight');
	}).mouseleave(function() {
		if( $(this).find('input').attr('checked') )
		{
			return 0;
		}
		$(this).removeClass('highlight');
	});

	$('.snippet-delete').click(function(e) {
		e.preventDefault();
		var url = $(this);
		tinyMCEPopup.editor.windowManager.confirm("Are you sure you want to delete this snippet?", function (s) {
			if(s)
			{
				$.ajax({
		            url: $(url).attr('href'),
		            success: function(data) {
		            	if( data == 'True' )
		            	{
		            		tinyMCEPopup.editor.windowManager.alert("The snippet was deleted successfully.");	
		            		$(url).parent().remove();
		            	}
		            	else
		            	{
		            		tinyMCEPopup.editor.windowManager.alert("Something when wrong. The snippet wasn't deleted: " + data);
		            	}
		            }
		        });
			}	
			else
			{
				return false;
			}
		});
	});

	$('.snippet-folder').hide();

	$('label').click(function() {
		var name = $(this).attr('for');
		var el = $('#' + name);

		if( $(el).css('display') == 'none' )
		{
			$(el).slideDown();
			$(this).find('span').removeClass('closed').addClass('open').text('-');
		}
		else
		{
			if( $(el).children().find(':checked').length > 0 )
			{
				return true;
			}
			$(this).find('span').removeClass('open').addClass('closed').text('+');
			$(el).slideUp();
		}
	});

	function buildLayout(layout, folder)
	{
		if( layout === undefined )
		{
			var layout = $('#snippet-directory').html();
			layout = jQuery.parseJSON(layout);
		}

		if( folder === undefined )
		{
			folder = $('#snippet-browser');
		}

		for ( i in layout ) 
		{
			if( typeof( layout[i] ) == 'string' )
			{
				var el = $('#snippet-browser-' + i).detach();
				folder.append( el );
			}
			else if( typeof( layout[i] ) == 'object' )
			{
				var el = makeFolder(folder, i);
				$(folder).append(el);

				buildLayout( layout[i], el );
			}
		}
	}

	function catchEdit()
	{
		var referrer = document.referrer;

		var match = referrer.match(/(\?|&)snippet-id=([a-zA-Z0-9-]+)(&|$|)?/);

		if( match != null )
		{
			reload(match[2]);
		}
	}

	function fillEmptyFolders()
	{
		var folders = $('#snippet-browser .snippet-folder');

		$(folders).each(function() {
			if( $(this).html() == '' )
			{
				$(this).html('<div class="empty">(empty)</div>')
			}
		});
	}

	function makeFolder(parent, folderName)
	{
		if( parent === undefined || folderName === undefined )
		{
			return false;
		}

		var folderId = 'snippet-folder-' + folderName;
		var newFolder = '<div class="snippet-folder" id="' + folderId + '"></div>';
		var label = '<label for="' + folderId + '"><span class="snippet-toggle closed">+</span>' + folderName + '</label>';

		$(parent).append(label);
		$(parent).append(newFolder);

		return $('#' + folderId);
	}

	function sanitize(snippetId)
	{
		snippet = snippetId.replace(/\./g, '\\.');
		snippet = snippet.replace(/\:/g, '\\:');

		return snippet;
	}

	function setPreviewWindow(snippet)
	{

		selectedSnippet = getSelectionElement();
		selectedSnippet.val(snippet);
		setSelected();
	}

	function getSelectionElement()
	{
		//We need to do this the "hard" way because, when returning from 
		//the snippet edit window, the t variable is nowhere to be found

		windows = tinyMCEPopup.editor.windowManager.windows

		for( value in windows ) {
			element = windows[value].element.get()
			frame = $(element).find('iframe')
			doc = $(frame).contents()
			if( $(doc).find('#snippet-selection').length >= 1 )
			{
				element = $(doc).find('#snippet-selection');
				return element;
			}
		}
	}
})

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

	$('#snippet-browser div.snippet-box').click(function() {

		$('.snippet-box').removeClass('highlight');
		$(this).find('input').attr('checked', true);
		$(this).addClass('highlight');
	});

	$('#snippet-browser div.snippet-box, #snippet-browser .snippet-folder-link').mouseenter(function() {
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

	$('.snippet-folder-link').click(function() {
		var val = $(this).text();

		var el = $('#snippet-directory-leaves').find('div[data-folder-name="' + val + '"]');
		setFolder(el);
	});

	$('div#snippet-folder-layout .folder').click(function() {
		
		setFolder(this);
	})

	function buildLayout(layout, folder)
	{
		if( layout === undefined )
		{
			var layout = $('#snippet-directory').html();
			layout = jQuery.parseJSON(layout);
		}

		if( folder === undefined )
		{
			var start = $('#snippet-directory-leaves');
			$(start).append('<div data-folder-depth="0" class="folder" data-folder-name=".snippets"><span class="marker">&#9707;</span><span class="folder-title" >Home</span></div>');

			folder = $('#snippet-directory-leaves > div')
		}

		for ( i in layout ) 
		{
			var self = layout[i];

			if( self['id'] === undefined )
			{
				var el = $('#snippet-browser-' + self['title']).attr('data-folder', folder.attr('data-folder-name'));
			}
			else
			{
				var el = makeFolder(folder, self);
				$(folder).after(el);

				var link = '<div class="snippet-folder-link" style="display: none;" data-parent-id="' + 
							folder.attr('data-folder-name') +
							'" id="snippet-link-' +
							self['id'] + 
							'">' +
							'<span>' +
							self['title'] + 
							'</span>' +
							'</div>';

				$('#snippet-browser').append( link )

				buildLayout( self['children'], el );
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

	function setFolder(element)
	{
		if( $(element).find('span.marker').hasClass('opened') )
		{
			$(element).find('span.marker').removeClass('opened');
			$('.snippet-box').show();
			$('.snippet-folder-link').hide();
			$('#folder-label').text('All Snippets');
			return true;
		}

		$(element).parent().find('span.marker').removeClass('opened');
		$(element).find('span.marker').addClass('opened');

		$('.snippet-folder-link').hide();
		$('#snippet-browser').find('div[data-parent-id="' + $(element).attr('data-folder-name') + '"]').show();

		var name = $(element).attr('data-folder-name');
		var title = $(element).find('span.folder-title').text();

		$('.snippet-box').hide();
		$('.snippet-box[data-folder="' + name + '"]').show();
		$('#folder-label').text(title);
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

	function makeFolder(parent, folder)
	{
		if( parent === undefined || folder === undefined )
		{
			return false;
		}

		var depth = parseInt($(parent).attr('data-folder-depth')) + 1;
		var leader = '';

		for( var i = 0; i < depth; i++ )
		{
			leader = leader + '&nbsp;&nbsp;&nbsp;&nbsp;';
		}

		leader += '<span class="marker">&#9707;</span>';

		var newFolder = '<div class="folder" data-folder-depth="' + 
						depth + '" data-folder-name="' + 
						folder['id'] + '">' + 
						leader + 
						'<span class="folder-title">' +
						folder['title'] + 
						'</span></div>';

		return $(newFolder);
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

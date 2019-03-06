function GetLines(){
	var finaltext = "";
	var text = $('#sql').val();
	var lines = text.split('\n');
	for(var x = 0; x < lines.length; x++){
		finaltext += VerifyLine(lines[x]) + "\n";
	}
	$('#model').val(finaltext);
	
	if(finaltext != "\n"){
		$('#sql').attr('disabled', 'true');
		$('#btndados').removeAttr('disabled');
	}
	
}

function VerifyLine(line) {
	var text = "";
	var elements = line.split(/\s+/);
	if(elements.length == 3){
		text += "public ";
		text += InputType(elements[1]);
		if(InputType(elements[1]) != "string"){
			if (elements[2] == "Checked"){
				text += "?" + " ";
			}else{
				text += " ";
			}
		}else{
			text += " ";
		}
		text += elements[0] + " ";
		text += "{ get; set; }";
		text += "\n"
	}
	else
		if (elements.length == 4){
			text += "public";
			text += InputType(elements[1]) + " ";
			if (elements[4] == "Checked"){
				text += "?" + " ";
			}else{
				text += " ";
			}
			text += elements[0] + " ";
			text += "{ get; set; }";
			text += "\n"
		}
		return text;
	}

	function InputType(Type){
		switch(Type) {
			case "int":
			return "int";
			break;
			case "bit":
			return "bool";
			break;
			case "date":
			return "DateTime";
			break;
			case "datetime":
			return "DateTime";
			break;
			default:
			if (Type.includes("decimal"))
				return "decimal";
			else
				if (Type.includes("varchar"))
					return "string";
				else	
					return "null";
			}
		}

		function InsertData(){
			
			$('#btndados').attr('disabled', 'true');
			$('#allrequired').removeAttr('disabled');
			$('#alltextlenght').removeAttr('disabled');
			$('#allname').removeAttr('disabled');

			var text = $('#model').val();
			var lines = text.split('\n');

			for(var x = 0; x < lines.length; x++){
				
				var elements = lines[x].split(/\s+/);
				if(elements != ""){
					$('#modeledit').append('<div class="row" style="padding-top: 15px">' +
						'<div class="btn-group dropright">' +
						'<button type="button" class="btn btn-info btn-sm" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">+</button>' +
						'<div class="dropdown-menu">' +
						'<a class="dropdown-item" onclick="AddDataAnnotations(1, ' + x + ');AddViewObject(1, ' + x + ',' + elements[2] + ')">Required</a>' +
						'<a class="dropdown-item" onclick="AddDataAnnotations(2, ' + x + ');AddViewObject(2, ' + x + ',' + elements[2] + ')">Tam. Conteúdo</a>' +
						'<a class="dropdown-item" onclick="AddDataAnnotations(3, ' + x + ');AddViewObject(3, ' + x + ',' + elements[2] +')">Name</a>' +
						'</div>' +
						'</div>' +
						'<div id="data'+ x +'">' +
						' <label>public ' + elements[1] + ' ' + elements[2] + ' { get; set; }</label>' +
						'</div>' +
						'</div>' +
						'<hr>');
				}
			}

			InsertView();
		}

		function AddDataAnnotations(type, id){

			var data = [];

			$('#data' + id).find('.dataannotations').each(function (index) {
				if($(this).attr('data-type') == type){
					data.push({
						Value: type
					})
					$(this).remove();
				}
			});

			if(data.length > 0){
				return;
			}

			switch(type) {
				case 1:
				$('#data' + id).prepend('<div class="dataannotations" data-type="' + type +'"><label>[Required(ErrorMessage = "{0} é obrigatorio")]</label><br /></div>');
				break;
				case 2:
				$('#data' + id).prepend('<div class="dataannotations" data-type="' + type +'"><label>[StringLength(###, ErrorMessage = "{0} suporta no máximo {1} caracter(es)")]</label><br /></div>');
				break;
				case 3:
				$('#data' + id).prepend('<div class="dataannotations" data-type="' + type +'"><label>[Display(Name = "###")]</label><br /></div>');
				break;
				default:
				return null;
			}

		}

		function AddDataAnnotationsAll(type){
			
			var text = $('#model').val();
			var lines = text.split('\n');

			for(var x = 0; x < lines.length; x++){
				
				var elements = lines[x].split(/\s+/);
				if(elements != ""){
					AddDataAnnotations(type, x);
					AddViewObject(type, x, elements[2]);
				}
			}
		}

		function InsertView(){

			var text = $('#model').val();
			var lines = text.split('\n');

			for(var x = 0; x < lines.length; x++){

				var elements = lines[x].split(/\s+/);
				if(elements != ""){
					$('#viewedit').append('<div class="row" style="padding-top: 15px">' +
						'<div class="btn-group dropright">' +
						'<button type="button" class="btn btn-info btn-sm" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">+</button>' +
						'<div class="dropdown-menu">' +
						'<a class="dropdown-item" onclick="AddViewObject(1, ' + x + ', \'' + elements[2] + '\')">Dropdown</a>' +
						'</div>' +
						'</div>' +
						'<div id="view'+ x +'">' +
						' <label id="main'+ x +'" data-type="textbox">@Html.TextBoxFor(x => x.' + elements[2] + ', new { @class = "form-control" })</label>' +
						'</div>' +
						'</div>' +
						'<hr>');
				}
			}
		}

		function AddViewObject(type, id, obj){
			debugger
			var data = [];

			$('#view' + id).find('.viewobject').each(function (index) {
				if($(this).attr('data-type') == type){
					data.push({
						Value: type
					})
					$(this).remove();
				}
			});

			if(data.length > 0){
				return;
			}

			switch(type) {
				case 1:
				if($('#main'+ id).attr('data-type') == "drop"){
					$('#main'+ id).replaceWith(' <label id="main'+ id +'" data-type="textbox">@Html.TextBoxFor(x => x.' + obj + ', new { @class = "form-control" })</label>');
				}else{
					$('#main'+ id).replaceWith(' <label id="main'+ id +'" data-type="drop">@Html.DropDownListFor(x => x.' + obj + ', new SelectList(ViewBag.###, "Value", "Text"), "Selecione uma opção", new { @class = "auto-complete" })</label>');
				}
				break;
				case 2:
				$('#view' + id).append('<div class="viewobject" data-type="' + type +'"><label>@Html.ValidationMessageFor(x => x.' + obj + ', "", new { @class = "text-danger" })</label><br /></div>');
				break;
				case 3:
				$('#view' + id).prepend('<div class="viewobject" data-type="' + type +'"><label>@Html.LabelFor(x => x.' + obj + ')</label><br /></div>');
				break;
				default:
				return null;
			}
		}
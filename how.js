var Tables = function(viewport, quantity) {

    var that = this;
    that.quantity = quantity;
    that.viewport = viewport;
    that.dim = 0;

    that.tables = [];

    that.singleDiv = jQuery('<div>').css({position: 'absolute'}).addClass('table');
    that.direction = undefined;
    that.setDirection = function(direction) {
	var alignment = direction.split('-');
	var rows = 2;
	var cols = parseInt(Math.ceil(that.quantity / 2));
	if (alignment[0] == 'top' || alignment[0] == 'bottom') {
	    rows = cols;
	    cols = 2;
	}
	var width = that.viewport.width / cols;
	var height = that.viewport.height / rows;
	that.dim = Math.min(width, height) * 0.5;
	that.singleDiv.css({height: that.dim, width: that.dim});
	var positions = [];
	for (var i = 0; i < that.quantity; i++) {
	    var position = { top: 0, left: 0 };
	    switch (alignment[1]) {
	    case 'straight':
		position.top = parseInt(Math.floor(2 * i / that.quantity));
		position.left = i % parseInt((that.quantity+1) / 2);
		break;
	    case 'uturn':
		position.top = parseInt(Math.floor(2 * i / that.quantity));
		position.left = Math.min(i, (that.quantity-1-i));
		break;
	    case 'snake':
		position.top = i % 4;
		position.top = Math.min(position.top, 3 - position.top);
		position.left = parseInt(Math.floor(i / 2));
		break;
	    }
	    positions[i] = position;
	}
	if (that.quantity % 2) {
	    var skewed = (alignment[1] == 'snake') ? (that.quantity - 1) : ((that.quantity - 1) / 2);
	    positions[skewed].top = 0.5;
	}
	that.tables = [];
	for (var i = 0; i < that.quantity; i++) {
	    that.tables[i] = that.singleDiv.clone();
	    that.tables[i].text(i+1);
	    switch (alignment[0]) {
	    case 'left':
		positions[i].left += (width-that.dim)/(width*2);
		positions[i].top += (height-that.dim)/(height*2);
		that.tables[i].css({left: positions[i].left * width,
				    top: positions[i].top * height});
		break;
	    case 'right':
		positions[i].left -= (width-that.dim)/(width*2);
		positions[i].top += (height-that.dim)/(height*2);
		that.tables[i].css({left: (Math.ceil(that.quantity / 2) - positions[i].left - 1) * width,
				    top: positions[i].top * height});
		break;
	    case 'top':
		positions[i].left += (height-that.dim)/(height*2);
		positions[i].top += (width-that.dim)/(width*2);
		that.tables[i].css({top: positions[i].left * height,
				    left: positions[i].top * width});
		break;
	    case 'bottom':
		positions[i].left -= (height-that.dim)/(height*2);
		positions[i].top += (width-that.dim)/(width*2);
		that.tables[i].css({top: (Math.ceil(that.quantity / 2) - positions[i].left - 1) * height,
				    left: positions[i].top * width});
		break;
	    }
	}
    }

    that.getPosition = function(position, size) {
	var pos = position.toString().match(/^(\d+)([NEWS]?)$/);
	if (!pos) {
	    throw 'Illegal position';
	}
	var tableNo = parseInt(pos[1]);
	if (tableNo > that.tables.length || tableNo < 1) {
	    throw 'Table number out of range';
	}
	var offset = { left: parseInt(that.tables[tableNo-1].css('left')),
		       top: parseInt(that.tables[tableNo-1].css('top')) };
	switch (pos[2]) {
	case 'N':
	    offset.left += that.dim / 2;
	    break;
	case 'E':
	    offset.left += that.dim;
	    offset.top += that.dim / 2;
	    break;
	case 'S':
	    offset.left += that.dim / 2;
	    offset.top += that.dim;
	    break;
	case 'W':
	    offset.top += that.dim / 2;
	    break;
	default:
	    offset.top += that.dim / 2;
	    offset.left += that.dim / 2;
	}
	if (size) {
	    offset.top -= size/2;
	    offset.left -= size/2;
	}
	return offset;
    }

    that.display = function() {
	for (var i = 0; i < that.tables.length; i++) {
	    that.viewport.container.append(that.tables[i]);
	}
    }

};

var Pair = function(startingPosition, number, movement) {
    var that = this;
    that.players = [ startingPosition, startingPosition.replace("N", "S").replace("E", "W") ];
    that.number = number;
    that.movement = movement;
    that.containers = [];
    that.size = that.movement.tables.dim * 0.3;
    that.colour = '#'+('00000'+(Math.random()*(1<<24)|0).toString(16)).slice(-6);
    for (var i = 0; i < 2; i++) {
	that.containers[i] = jQuery('<div>').addClass('player').css({backgroundColor: that.colour, position: 'absolute', lineHeight: that.size+'px', width: that.size, height: that.size, borderRadius: that.size}).text(that.number);
    }

    that.moveTo = function(position) {
	for (var i = 0; i < 2; i++) {
	    if (position) {
		that.players[i] = position;
		var pos = that.movement.tables.getPosition(position, that.size);
		that.containers[i].animate(pos, 1000, 'easeInOutBack');
		position = position.replace('N', 'S').replace('E', 'W');
	    }
	    else {
		that.containers[i].animate({left: 0, top: 0}, 1000, 'easeInOutBack');
	    }
	}
    }

    that.display = function() {
	for (var i = 0; i < 2; i++) {
	    movement.viewport.container.append(that.containers[i]);
	    that.containers[i].animate(that.movement.tables.getPosition(that.players[i], that.size), 1000, 'easeInOutBack');
	}
    }
}

var Set = function(startingPosition, movement, number) {
    var that = this;
    that.movement = movement;
    that.number = number;
    that.position = startingPosition;
    that.colour = '#'+('00000'+(Math.random()*(1<<24)|0).toString(16)).slice(-6);
    that.size = that.movement.tables.dim * 0.2;
    that.container = jQuery('<div>').addClass('cards').css({position: 'absolute', width: that.size, height: that.size*1.5, backgroundColor: that.colour, top: that.movement.viewport.height-that.size}).text(that.number);

    that.getPosition = function(position) {
	var pos;
	if (parseInt(position) == pos && position > 0) {
	    pos = that.movement.tables.getPosition(position, that.size);
	}
	else {
	    var after = parseInt(position);
	    pos = that.movement.tables.getPosition(after, that.size);
	    var afterPos = that.movement.tables.getPosition(after%that.movement.tables.quantity+1, that.size);
	    if (after == that.movement.tables.quantity) {
		pos.top = Math.min(Math.max(0, pos.top + (pos.top - afterPos.top) * (position - after)), that.movement.viewport.height - that.size);
		pos.left = Math.min(Math.max(0, pos.left + (pos.left - afterPos.left) * (position - after)), that.movement.viewport.width - that.size);
	    }
	    else {
		pos.top = Math.min(Math.max(0, pos.top + (afterPos.top - pos.top) * (position - after)), that.movement.viewport.height - that.size);
		pos.left = Math.min(Math.max(0, pos.left + (afterPos.left - pos.left) * (position - after)), that.movement.viewport.width - that.size);
	    }
	}
	pos.top -= that.size * 0.25;
	return pos;
    }

    that.moveTo = function(position) {
	that.position = position;
	if (position) {
	    that.container.animate(that.getPosition(position), 1000, 'easeInOutBack');
	}
	else {
	    that.container.animate({left: 0, top: that.movement.viewport.height - that.size}, 1000, 'easeInOutBack');
	}
    }

    that.display = function() {
	that.movement.viewport.container.append(that.container);
	that.moveTo(that.position);
    }
}

var Movement = function(viewport, movement, tables, summary) {
    var that = this;
    that.viewport = viewport;
    that.data = movement;
    that.tables = tables;
    that.round = 1;
    that.summary = summary;

    that.pairs = [];
    for (var i = 0; i < tables.quantity * 2; i++) {
	that.pairs[that.data.positions[i]] = new Pair(parseInt(Math.ceil((i+1)/2)) + ['N','E'][i%2], that.data.positions[i], that);
	that.pairs[that.data.positions[i]].display();
    }

    that.sets = [];
    var lastTable = 0;
    var emptySets = 0;
    for (var i = 0; i < that.data.sets.length; i++) {
	if (that.data.sets[i]) {
	    lastTable = that.data.sets[i];
	    emptySets = 0;
	}
	else {
	    emptySets++;
	    for (var j = i - emptySets + 1; j <= i; j++) {
		that.data.sets[j] = lastTable + 0.25 + 0.5*(j - i + emptySets)/(emptySets+1);
	    }
	}
    }
    for (var i = 0; i < that.data.sets.length; i++) {
	that.sets[i] = new Set(that.data.sets[i], that, i+1);
	that.sets[i].display();
    }
	
    that.step = function() {
	if (summary) {
	    summary.update(that);
	}
	if (that.round < that.data.rounds) {
	    for (var p in that.pairs) {
		var position = that.pairs[p].players[0];
		var ind = that.data.movement.indexOf(position);
		if (ind > -1) {
		    that.pairs[p].moveTo(that.data.movement[(ind+1)%that.data.movement.length]);
		}
		else {
		    that.pairs[p].moveTo(position);
		}
	    }
	    that.data.sets.unshift(that.data.sets.pop());
	    for (var s in that.sets) {
		that.sets[s].moveTo(that.data.sets[s]);
	    }
	    that.round++;
	    return true;
	}
	else {
	    for (var p in that.pairs) {
		that.pairs[p].moveTo();
	    }
	    for (var s in that.sets) {
		that.sets[s].moveTo();
	    }
	    return false;
	}
    }
}

var Summary = function(pairs) {

    var that = this;

    that.pairs = pairs;
    that.table = jQuery('<table>').addClass('summary');
    for (var i = 0; i <= that.pairs; i++) {
	var row = jQuery('<tr>');
	for (var j = 0; j <= that.pairs; j++) {
	    var cell;
	    if (i == 0 && j) {
		cell = jQuery('<th>');
		cell.text(j);
	    }
	    else if (j == 0 && i) {
		cell = jQuery('<th>');
		cell.text(that.pairs - i + 1);
	    }
	    else {
		cell = jQuery('<td>');
	    }
	    row.append(cell);
	}
	that.table.append(row);
    }

    that.update = function(movement) {
	for (var pair in movement.pairs) {
	    that.table.find('th:contains('+movement.pairs[pair].number+')').css({backgroundColor: movement.pairs[pair].colour});
	}
	var played = [];
	for (var t = 1; t <= movement.tables.quantity; t++) {
	    played[t] = { set: movement.data.sets.indexOf(t),
			  pairs: [] };
	}
	for (var p in movement.pairs) {
	    played[parseInt(movement.pairs[p].players[0])].pairs.push(parseInt(p));
	}
	for (var pl in played) {
	    played[pl].pairs.sort(function(a,b){return b-a;});
	    var cell = that.table.find('tr').eq(movement.tables.quantity*2 + 1 - played[pl].pairs[0]).find('td').eq(played[pl].pairs[1]-1);
	    cell.css({backgroundColor: movement.sets[played[pl].set].colour});
	    cell.text(pl);
	}
    }
    
    that.clear = function() {
	that.table.remove();
    }

    that.render = function(where) {
	if (!where) {
	    where = jQuery('body');
	}
	jQuery(where).append(that.table);
    }
}

var Viewport = function(width, height) {
    var that = this;
    that.width = width;
    that.height = height;
    that.container = jQuery('<div>').css({height: that.height, width: that.width, position: 'relative'}).addClass('viewport');

    that.clear = function() {
	that.container.html('');
    }

    that.render = function(where) {
	if (!where) {
	    where = jQuery('body');
	}
	jQuery(where).append(that.container);
    }
};

var Control = function(movement) {
    var that = this;

    that.movement = movement;

    that.setMovement = function(movement) {
	that.movement = movement;
    }

    that.step = function() {
	if (!that.movement.step()) {
	    that.stop();
	    that.container.hide();
	};
	if (that.autoplay) {
	    that.autoTimeout = setTimeout(that.step, 1500);
	}
    }

    that.autoplay = false;
    that.autoTimeout = undefined;
    that.play = function() {
	that.autoplay = true;
	that.step();
	that.playButton.hide();
	that.stopButton.show();
	that.stepButton.hide();
    }

    that.stop = function() {
	that.autoplay = false;
	clearTimeout(that.autoTimeout);
	that.stopButton.hide();
	that.playButton.show();
	that.stepButton.show();
    }


    that.container = jQuery('<div>').addClass('controls');

    that.stepButton = jQuery('<div>').addClass('step').text('>|');
    that.playButton = jQuery('<div>').addClass('play').text('>');
    that.stopButton = jQuery('<div>').addClass('stop').text('||');

    that.container.append(that.stepButton).append(that.playButton).append(that.stopButton);
    jQuery('body').append(that.container);

    that.stepButton.bind('click', that.step);
    that.playButton.bind('click', that.play);
    that.stopButton.bind('click', that.stop);

}

jQuery(document).ready(function() {
    var vp = new Viewport(jQuery(window).width()*0.6, jQuery(window).height()*0.9);
    vp.render();
    var movements;
    var moveList = jQuery('.selector .list');
    jQuery.getJSON('movements.json', function(data) {
	movements = data;
	for (var m in movements) {
	    var move = m.split('-');
	    var listCell = jQuery('<div>').addClass('list-movement').attr('data-movement', m).text(move[0]);
	    var listRow = moveList.find('div[data-rounds="'+move[1]+'"]');
	    if (listRow.size()) {
		listRow.append(listCell);
	    }
	    else {
		moveList.append(jQuery('<div>').addClass('list-row').attr('data-rounds', move[1]).append(jQuery('<div>').addClass('list-movement').text(move[1])).append(listCell));
	    }
	}
	var sum;
	var control = new Control();
	control.container.hide();
	jQuery('.selector .list .list-movement[data-movement]').click(function() {
	    vp.clear();
	    if (sum) {
		sum.clear();
	    }
	    control.stop();
	    var move = movements[jQuery(this).attr('data-movement')];
	    var t = new Tables(vp, move.tables);
	    var direction = jQuery('.layout .direction').val() + '-' + jQuery('.layout .way').val();
	    t.setDirection(direction);
	    t.display();
	    sum = new Summary(move.tables * 2);
	    sum.render();
	    move = new Movement(vp, move, t, sum);
	    control.setMovement(move);
	    control.container.show();
	});
    });
});

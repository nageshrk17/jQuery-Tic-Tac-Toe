// The first player
var player1 = {
        mark: "O",
        name: "Player 1",
        style: "player1_cell",
        score_el: "player1_wins",
        wins: 0
    },
    // The second player
    player2 = {
        mark: "X",
        name: "Player 2",
        style: "player2_cell",
        score_el: "player2_wins",
        wins: 0
    },
    players = [player1, player2],
    current_player = 0,
    num_of_cols = num_of_rows = 3;
$(document).ready(function() {
    $("#restart_game").bind("click", restartGame);
    // A player wins when he has a full row / column / diagonal
    $.expr[":"].mod = function(a, b, e) {
        return b % e[3] === 0
    };
    $.expr[":"].sub_mod = function(a, b, e) {
        a = e[3].split(",");
        return (b - a[0]) % a[1] === 0
    };
    initGame()
});

function initGame() {

    // Emptying the div so that it will only contain what we put in it ourselves
    $("#game_board").empty();

    // Create a div to be a cell in the Game Board.

    for (var a = 0; a < num_of_cols * num_of_rows; ++a) {

        var b = $("<div></div>").addClass("cell").appendTo("#game_board");

        // Adding the line breaks to handle the rows
        a % num_of_cols === 0 && b.before('<div class="clear"></div>')
    }
    $("#game_board .cell").bind("click", playMove).bind("mouseover", hoverCell).bind("mouseout", leaveCell);
    initTurn(current_player)
}

function disableGame() {
    $("#game_board .cell").unbind("click").unbind("mouseover").unbind("mouseout");
}

function restartGame(event) {
    event.preventDefault();
    $(".end").hide();
    current_player = 0;
    initGame();
    return false
}

function playMove() {
    $(this).addClass(players[current_player].style).addClass("marked").text(players[current_player].mark).trigger("mouseout").unbind("click mouseover mouseout");
    if (!checkAndProcessWin()) {
        current_player = ++current_player % players.length;
        initTurn(current_player)
    }
    return false
}

function initTurn() {
    $("#player_name").text(players[current_player].name);
    $("#player_mark").text(players[current_player].mark)
}

function hoverCell() {
    $(this).addClass("hover");
    return false
}

function leaveCell() {
    $(this).removeClass("hover");
    return false
}

function checkAndProcessWin() {
    var a = players[current_player].style,
        b = false;
        
    // Code to Check the Rows/Columns/Diagonals.
    if ($("#game_board ." + a).length >= num_of_cols) {
        for (var e = $("#game_board .cell"), c = {}, d = 1; d <= num_of_rows && !b; ++d) {
            c = e.filter(":lt(" + num_of_cols * d + ")").filter(":eq(" + num_of_cols * (d - 1) + "),:gt(" + num_of_cols * (d - 1) + ")").filter("." + a);
            if (c.length == num_of_cols) b = true
        }
        for (d = 0; d <= num_of_cols && !b; ++d) {
            c = e.filter(":sub_mod(" + d + "," + num_of_rows + ")").filter("." + a);
            if (c.length == num_of_rows) b = true
        }
        if (!b) {
            c = e.filter(":mod(" + (num_of_rows + 1) + ")").filter("." +
                a);
            if (c.length == num_of_rows) b = true;
            else {
                c = e.filter(":mod(" + (num_of_rows - 1) + "):not(:last,:first)").filter("." + a);
                if (c.length == num_of_rows) b = true
            }
        }
    }
    if (b) {
        disableGame();
        c.addClass("win");
        ++players[current_player].wins;
        $("#winner #winner_name").text(players[current_player].name);
        $("#" + players[current_player].score_el).text(players[current_player].wins);
        $(".end").show()
    } else $("#game_board .marked").length == num_of_rows * num_of_cols && $("#ask_restart").show();
    return b
}

// Function to Toggle the Instruction
function toggleSlider() {
    if ($("#panel").is(":visible")) {
        $("#contentFades").animate({
                opacity: "0"
            },
            600,
            function() {
                $("#panel").slideUp();
            }
        );
    } else {
        $("#panel").slideDown(600, function() {
            $("#contentFades").animate({
                    opacity: "1"
                },
                600
            );
        });
    }
}

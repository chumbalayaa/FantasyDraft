FantasyDraft
============

This will ensure a victorious fantasy football season for Chums and Karson


####v 1.0
Version 1.0 has the following features
* Custom scoring and league setup
* Aggregated data from fantasypros.com for QB, RB, WR, and TE
* Data from espn.com for K and D/ST
* Fantasy Position Index (FPI) ranking for each player given custom scoring


####v 2.0
Version 2.0 is currently in beta and will have the following features
* Sack data for Quarterbacks (pending a trusted source)
* An enchanced UI
* Factoring in the flex position for the FPI algorithm
* A rich display for the results (draft) page



##### FPI
Here we use FPI to try to guess at a fantasy player's worth when compared to 
other players in the NFL, even when they do not play the same position. This
works by calculating the worst "starting" player at a given position's projected
fantasy score over a season, and making that the baseline for that position. 
Then, for every other player, their FPI is simply their projected fantasy 
score minus that baseline for their position. It basically says, "How good
is this player compared to the rest of the players at their position? Can I 
wait to draft them, or is their value so high that I should draft them soon?".
For example, Tight Ends are not usually Fantasy goliaths, but Jimmy Graham
is just so much better than every other tight end, that he will usually make
the top 10 no matter what. FPI does not factor in outside statistics and is
solely a measure of both the individual potential of a player and that entire
potential of that position in Fantasy Football.


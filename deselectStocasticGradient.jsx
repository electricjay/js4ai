/*
   Deselects objects randomly, where the chance of deselection depends on the
   distance from the top of the selection.
   Copyright 2012 Jay Cox
*/

/* TODO: Allow the selection of different shaped gradients
 *      (radial, left to right etc.)
 */

if (app.activeDocument.selection.length == 0)
{
    alert("You must select at least 1 object to run this script"); 
}
else
{
    var new_selection = stocastic_filter_objects(app.activeDocument.selection, true);
    app.activeDocument.selection = []; // Deselect all objects
    /* Unfortunately we can't just asign new_selecton to the document selection
       because Illustrator CS3 will only use the first 1000 objects */
    for (var i=0; i<new_selection.length; i++)
    {
        new_selection[i].selected = true;
    }
}

function stocastic_filter_objects(objects)
{   
    var selection_bounds = get_bounding_box_of_objects(objects);
    var selection_height = selection_bounds[1] - selection_bounds[3];
    var selection_width  = selection_bounds[2] - selection_bounds[0];
    var sel_center_x = (selection_bounds[0] + selection_bounds[2]) / 2;
    var sel_center_y = (selection_bounds[1] + selection_bounds[3]) / 2;
    var selected = [];
    var radial = false;
    for (var i=0; i<objects.length; i++)
    {
        var current_object = objects[i];
        var bounds = current_object.visibleBounds;
        var center_x = (bounds[2] + bounds[0])/2;
        var center_y = (bounds[3] + bounds[1])/2;
        if (radial)
        {
            var distance;
            distance = Math.sqrt((sel_center_x - center_x)*(sel_center_x - center_x) / (.25 * selection_width*selection_width) +
                                 (sel_center_y - center_y)*(sel_center_y - center_y) / (.25 * selection_height*selection_height));
            if (Math.random() < distance)
                selected.push(current_object);
        }
        else
        {
            if (Math.random() < ((selection_bounds[1] - center_y)/selection_height))
                selected.push(current_object);
        }
    }
    return selected;
}


alert ("Document selection now has " + app.activeDocument.selection.length + " objects selected");

function get_bounding_box_of_objects(objects)
{
    box = objects[0].visibleBounds;
    for (var i = 1; i < objects.length; i++)
    {
        obox = objects[i].visibleBounds;
        if (obox[0] < box[0])
            box[0] = obox[0];
        if (obox[2] > box[2])
            box[2] = obox[2];
         if (obox[1] > box[1])
            box[1] = obox[1];
        if (obox[3] < box[3])
            box[3] = obox[3];
     }
    return box;
}

function dump_object_alert(obj)
{
    var expanded = '';
    for (i in obj)
    {
        try{
        expanded += i + ": " + obj[i] + "\n";
        }
        catch(e)
        {
            expanded += i + ": <exception caught>\n";
        }
    }
    alert (expanded); 
}

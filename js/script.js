/**


 * DataTable with Bootstrap 2.x
 * http://www.datatables.net/blog/Twitter_Bootstrap_2
 *
 * Added modification for first and last pagination buttons.
 * http://datatables.net/forums/discussion/9279/bootstrap-pagination-first-and-last-buttons/p1
 *
 */


/* Set the defaults for DataTable initialisation */
$.extend(true, $.fn.dataTable.defaults, {
    "sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
    "sPaginationType": "bootstrap",
    "oLanguage": {
        "sLengthMenu": "_MENU_ records per page"
    }
});


/* Default class modification */
$.extend($.fn.dataTableExt.oStdClasses, {
    "sWrapper": "dataTables_wrapper form-inline"
});


/* API method to get paging information */
$.fn.dataTableExt.oApi.fnPagingInfo = function (oSettings) {
    return {
        "iStart": oSettings._iDisplayStart,
        "iEnd": oSettings.fnDisplayEnd(),
        "iLength": oSettings._iDisplayLength,
        "iTotal": oSettings.fnRecordsTotal(),
        "iFilteredTotal": oSettings.fnRecordsDisplay(),
        "iPage": Math.ceil(oSettings._iDisplayStart / oSettings._iDisplayLength),
        "iTotalPages": Math.ceil(oSettings.fnRecordsDisplay() / oSettings._iDisplayLength)
    };
}

/* Bootstrap style pagination control */
$.extend($.fn.dataTableExt.oPagination, {
    "bootstrap": {
        "fnInit": function (oSettings, nPaging, fnDraw) {
            var oLang = oSettings.oLanguage.oPaginate;
            var fnClickHandler = function (e) {
                e.preventDefault();
                if (oSettings.oApi._fnPageChange(oSettings, e.data.action)) {
                    fnDraw(oSettings);
                }
            };

            $(nPaging).addClass('pagination').append(
                '<ul>' +
                    '<li class="first disabled"><a href="#">' + oLang.sFirst + '</a></li>' +
                    '<li class="prev  disabled"><a href="#">' + oLang.sPrevious + '</a></li>' +
                    '<li class="next  disabled"><a href="#">' + oLang.sNext + '</a></li>' +
                    '<li class="last  disabled"><a href="#">' + oLang.sLast + '</a></li>' +
                    '</ul>'
            );
            var els = $('a', nPaging);
            $(els[0]).bind('click.DT', { action: "first" }, fnClickHandler);
            $(els[1]).bind('click.DT', { action: "previous" }, fnClickHandler);
            $(els[2]).bind('click.DT', { action: "next" }, fnClickHandler);
            $(els[3]).bind('click.DT', { action: "last" }, fnClickHandler);
        },

        "fnUpdate": function (oSettings, fnDraw) {
            var iListLength = 5;
            var oPaging = oSettings.oInstance.fnPagingInfo();
            var an = oSettings.aanFeatures.p;
            var i, j, sClass, iStart, iEnd, iHalf = Math.floor(iListLength / 2);

            if (oPaging.iTotalPages < iListLength) {
                iStart = 1;
                iEnd = oPaging.iTotalPages;
            }
            else if (oPaging.iPage <= iHalf) {
                iStart = 1;
                iEnd = iListLength;
            } else if (oPaging.iPage >= (oPaging.iTotalPages - iHalf)) {
                iStart = oPaging.iTotalPages - iListLength + 1;
                iEnd = oPaging.iTotalPages;
            } else {
                iStart = oPaging.iPage - iHalf + 1;
                iEnd = iStart + iListLength - 1;
            }

            for (i = 0, iLen = an.length; i < iLen; i++) {
                // Remove the middle elements
                $('li:gt(1)', an[i]).filter(':not(.next,.last)').remove();

                // Add the new list items and their event handlers
                for (j = iStart; j <= iEnd; j++) {
                    sClass = (j == oPaging.iPage + 1) ? 'class="active"' : '';
                    $('<li ' + sClass + '><a href="#">' + j + '</a></li>')
                        .insertBefore($('.next,.last', an[i])[0])
                        .bind('click', function (e) {
                            e.preventDefault();
                            oSettings._iDisplayStart = (parseInt($('a', this).text(), 10) - 1) * oPaging.iLength;
                            fnDraw(oSettings);
                        });
                }

                // Add / remove disabled classes from the static elements
                if (oPaging.iPage === 0) {
                    $('.first,.prev', an[i]).addClass('disabled');
                } else {
                    $('.first,.prev', an[i]).removeClass('disabled');
                }

                if (oPaging.iPage === oPaging.iTotalPages - 1 || oPaging.iTotalPages === 0) {
                    $('.next,.last', an[i]).addClass('disabled');
                } else {
                    $('.next,.last', an[i]).removeClass('disabled');
                }
            }
        }
    }
});


/*
 * TableTools Bootstrap compatibility
 * Required TableTools 2.1+
 */
if ($.fn.DataTable.TableTools) {
    // Set the classes that TableTools uses to something suitable for Bootstrap
    $.extend(true, $.fn.DataTable.TableTools.classes, {
        "container": "DTTT btn-group",
        "buttons": {
            "normal": "btn",
            "disabled": "disabled"
        },
        "collection": {
            "container": "DTTT_dropdown dropdown-menu",
            "buttons": {
                "normal": "",
                "disabled": "disabled"
            }
        },
        "print": {
            "info": "DTTT_print_info modal"
        },
        "select": {
            "row": "active"
        }
    });

    // Have the collection use a bootstrap compatible dropdown
    $.extend(true, $.fn.DataTable.TableTools.DEFAULTS.oTags, {
        "collection": {
            "container": "ul",
            "button": "li",
            "liner": "a"
        }
    });
}


/* Table initialisation */
//$(document).ready(function () {
//    $('#example').dataTable({
//        "sDom": "<'row'<'span6'l><'span6'f>r>t<'row'<'span6'i><'span6'p>>",
//        "sPaginationType": "bootstrap",
//        "oLanguage": {
//            "sLengthMenu": "_MENU_ records per page"
//        }
//    });
//});

/**
 * File:        datatables.responsive.js
 * Version:     0.1.2
 * Author:      Seen Sai Yang
 * Info:        https://github.com/Comanche/datatables-responsive
 *
 * Copyright 2013 Seen Sai Yang, all rights reserved.
 *
 * This source file is free software, under either the GPL v2 license or a
 * BSD style license.
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * You should have received a copy of the GNU General Public License and the
 * BSD license along with this program.  These licenses are also available at:
 *     https://raw.github.com/Comanche/datatables-responsive/master/license-gpl2.txt
 *     https://raw.github.com/Comanche/datatables-responsive/master/license-bsd.txt
 */

'use strict';

/**
 * Constructor for responsive datables helper.
 *
 * This helper class makes datatables responsive to the window size.
 *
 * The parameter, breakpoints, is an object for each breakpoint key/value pair
 * with the following format: { breakpoint_name: pixel_width_at_breakpoint }.
 *
 * An example is as follows:
 *
 *     {
 *         tablet: 1024,
 *         phone: 480
 *     }
 *
 * These breakpoint name may be used as possible values for the data-hide
 * attribute.  The data-hide attribute is optional and may be defined for each
 * th element in the table header.
 *
 * @param {Object|string} tableSelector jQuery wrapped set or selector for
 *                                      datatables container element.
 * @param {Object} breakpoints          Object defining the responsive
 *                                      breakpoint for datatables.
 */
function ResponsiveDatatablesHelper(tableSelector, breakpoints) {
    if (typeof tableSelector === 'string') {
        this.tableElement = $(tableSelector);
    } else {
        this.tableElement = tableSelector;
    }

    // State of column indexes and which are shown or hidden.
    this.columnIndexes = [];
    this.columnsShownIndexes = [];
    this.columnsHiddenIndexes = [];

    // Index of the th in the header tr that stores where the attribute
    //     data-class="expand"
    // is defined.
    this.expandColumn = undefined;

    // Stores the break points defined in the table header.
    // Each th in the header tr may contain an optional attribute like
    //     data-hide="phone,tablet"
    // These attributes and the breakpoints object will be used to create this
    // object.
    this.breakpoints = {
        /**
         * We will be generating data in the following format:
         *     phone : {
         *         lowerLimit   : undefined,
         *         upperLimit   : 320,
         *         columnsToHide: []
         *     },
         *     tablet: {
         *         lowerLimit   : 320,
         *         upperLimit   : 724,
         *         columnsToHide: []
         *     }
         */
    };

    // Expand icon template
    this.expandIconTemplate = '<span class="responsiveExpander"></span>';

    // Row template
    this.rowTemplate = '<tr class="row-detail"><td><ul><!--column item--></ul></td></tr>';
    this.rowLiTemplate = '<li><span class="columnTitle"><!--column title--></span>: <span class="columnValue"><!--column value--></span></li>';

    // Responsive behavior on/off flag
    this.disabled = true;

    // Skip next windows width change flag
    this.skipNextWindowsWidthChange = false;

    // Initialize settings
    this.init(breakpoints);
}

/**
 * Responsive datatables helper init function.  Builds breakpoint limits
 * for columns and begins to listen to window resize event.
 *
 * See constructor for the breakpoints parameter.
 *
 * @param {Object} breakpoints
 */
ResponsiveDatatablesHelper.prototype.init = function (breakpoints) {
    /** Generate breakpoints in the format we need. ***************************/
    // First, we need to create a sorted array of the breakpoints given.
    var breakpointsSorted = [];
    _.each(breakpoints, function (value, key) {
        breakpointsSorted.push({
            name         : key,
            upperLimit   : value,
            columnsToHide: []
        });
    });
    breakpointsSorted = _.sortBy(breakpointsSorted, 'upperLimit');

    // Set lower and upper limits for each breakpoint.
    var lowerLimit = undefined;
    _.each(breakpointsSorted, function (value) {
        value.lowerLimit = lowerLimit;
        lowerLimit = value.upperLimit;
    });

    // Add the default breakpoint which shows all (has no upper limit).
    breakpointsSorted.push({
        name         : 'default',
        lowerLimit   : lowerLimit,
        upperLimit   : undefined,
        columnsToHide: []
    });

    // Copy the sorted breakpoint array into the breakpoints object using the
    // name as the key.
    for (var i = 0, l = breakpointsSorted.length; i < l; i++) {
        this.breakpoints[breakpointsSorted[i].name] = breakpointsSorted[i];
    }

    /** Create range of possible column indexes *******************************/
    // Get all visible column indexes
    var columns = this.tableElement.fnSettings().aoColumns;
    for (var i = 0, l = columns.length; i < l; i++) {
        if (columns[i].bVisible) {
            this.columnIndexes.push(i)
        }
    }

    // We need the range of possible column indexes to calculate the columns
    // to show:
    //     Columns to show = all columns - columns to hide
    var headerElements = $('thead th', this.tableElement);

    /** Add columns into breakpoints respectively *****************************/
        // Read column headers' attributes and get needed info
    _.each(headerElements, function (element, index) {
        // Get the column with the attribute data-class="expand" so we know
        // where to display the expand icon.
        if ($(element).attr('data-class') === 'expand') {
            this.expandColumn = index;
        }

        // The data-hide attribute has the breakpoints that this column
        // is associated with.
        // If it's defined, get the data-hide attribute and sort this
        // column into the appropriate breakpoint's columnsToHide array.
        var dataHide = $(element).attr('data-hide');
        if (dataHide !== undefined) {
            var splitBreakingPoints = dataHide.split(/,\s*/);
            _.each(splitBreakingPoints, function (e) {
                if (this.breakpoints[e] !== undefined) {
                    // Translate visible column index to internal column index.
                    this.breakpoints[e].columnsToHide.push(this.columnIndexes[index]);
                }
            }, this);
        }
    }, this);

    // Enable responsive behavior.
    this.disable(false);
};

ResponsiveDatatablesHelper.prototype.setWindowsResizeHandler = function(bindFlag) {
    if (bindFlag === undefined) {
        bindFlag = true;
    }

    if (bindFlag) {
        var that = this;
        $(window).bind("resize", function () {
            that.respond();
        });
    } else {
        $(window).unbind("resize");
    }
}

/**
 * Respond window size change.  This helps make datatables responsive.
 */
ResponsiveDatatablesHelper.prototype.respond = function () {
    if (this.disabled) {
        return;
    }

    // Get new windows width
    var newWindowWidth = $(window).width();
    var updatedHiddenColumnsCount = 0;

    // Loop through breakpoints to see which columns need to be shown/hidden.
    var newColumnsToHide = [];
    _.each(this.breakpoints, function (element) {
        if ((!element.lowerLimit || newWindowWidth > element.lowerLimit) && (!element.upperLimit || newWindowWidth <= element.upperLimit)) {
            newColumnsToHide = element.columnsToHide;
        }
    }, this);

    // Find out if a column show/hide should happen.
    // Skip column show/hide if this window width change follows immediately
    // after a previous column show/hide.  This will help prevent a loop.
    var columnShowHide = false;
    if (!this.skipNextWindowsWidthChange) {
        // Check difference in length
        if (this.columnsHiddenIndexes.length !== newColumnsToHide.length) {
            // Difference in length
            columnShowHide = true;
        } else {
            // Same length but check difference in values
            var d1 = _.difference(this.columnsHiddenIndexes, newColumnsToHide).length;
            var d2 = _.difference(newColumnsToHide, this.columnsHiddenIndexes).length;
            columnShowHide = d1 + d2 > 0;
        }
    }

    if (columnShowHide) {
        // Showing/hiding a column at breakpoint may cause a windows width
        // change.  Let's flag to skip the column show/hide that may be
        // caused by the next windows width change.
        this.skipNextWindowsWidthChange = true;
        this.columnsHiddenIndexes = newColumnsToHide;
        this.columnsShownIndexes = _.difference(this.columnIndexes, this.columnsHiddenIndexes);
        this.showHideColumns();
        updatedHiddenColumnsCount = this.columnsHiddenIndexes.length;
        this.skipNextWindowsWidthChange = false;
    }


    // We don't skip this part.
    // If one or more columns have been hidden, add the has-columns-hidden class to table.
    // This class will show what state the table is in.
    if (this.columnsHiddenIndexes.length) {
        this.tableElement.addClass('has-columns-hidden');
        var that = this;

        // Show details for each row that is tagged with the class .detail-show.
        $('tr.detail-show', this.tableElement).each(function (index, element) {
            var tr = $(element);
            if (tr.next('.row-detail').length === 0) {
                ResponsiveDatatablesHelper.prototype.showRowDetail(that, tr);
            }
        });
    } else {
        this.tableElement.removeClass('has-columns-hidden');
        $('tr.row-detail').remove();
    }
};

/**
 * Show/hide datatables columns.
 */
ResponsiveDatatablesHelper.prototype.showHideColumns = function () {
    // Calculate the columns to show
    // Show columns that may have been previously hidden.
    for (var i = 0, l = this.columnsShownIndexes.length; i < l; i++) {
        this.tableElement.fnSetColumnVis(this.columnsShownIndexes[i], true, false);
    }

    // Hide columns that may have been previously shown.
    for (var i = 0, l = this.columnsHiddenIndexes.length; i < l; i++) {
        this.tableElement.fnSetColumnVis(this.columnsHiddenIndexes[i], false, false);
    }

    // Rebuild details to reflect shown/hidden column changes.
    var that = this;
    $('tr.row-detail').remove();
    if (this.tableElement.hasClass('has-columns-hidden')) {
        $('tr.detail-show', this.tableElement).each(function (index, element) {
            ResponsiveDatatablesHelper.prototype.showRowDetail(that, $(element));
        });
    }
};

/**
 * Create the expand icon on the column with the data-class="expand" attribute
 * defined for it's header.
 *
 * @param {Object} tr table row object
 */
ResponsiveDatatablesHelper.prototype.createExpandIcon = function (tr) {
    if (this.disabled) {
        return;
    }

    // Get the td for tr with the same index as the th in the header tr
    // that has the data-class="expand" attribute defined.
    var tds = $('td', tr);
    var that = this;
    // Loop through tds and create an expand icon on the td that has a column
    // index equal to the expand column given.
    for (var i = 0, l = tds.length; i < l; i++) {
        var td = tds[i];
        var tdIndex = that.tableElement.fnGetPosition(td)[2];
        td = $(td);
        if (tdIndex === that.expandColumn) {
            // Create expand icon if there isn't one already.
            if ($('span.responsiveExpander', td).length == 0) {
                td.prepend(that.expandIconTemplate);

                // Respond to click event on expander icon.
                td.on('click', 'span.responsiveExpander', {responsiveDatatablesHelperInstance: that}, that.showRowDetailEventHandler);
            }
            break;
        }
    }
};

/**
 * Show row detail event handler.
 *
 * This handler is used to handle the click event of the expand icon defined in
 * the table row data element.
 *
 * @param {Object} event jQuery event object
 */
ResponsiveDatatablesHelper.prototype.showRowDetailEventHandler = function (event) {
    if (this.disabled) {
        return;
    }

    // Get the parent tr of which this td belongs to.
    var tr = $(this).closest('tr');

    // Show/hide row details
    if (tr.hasClass('detail-show')) {
        ResponsiveDatatablesHelper.prototype.hideRowDetail(event.data.responsiveDatatablesHelperInstance, tr);
    } else {
        ResponsiveDatatablesHelper.prototype.showRowDetail(event.data.responsiveDatatablesHelperInstance, tr);
    }

    tr.toggleClass('detail-show');

    // Prevent click event from bubbling up to higher-level DOM elements.
    event.stopPropagation();
};

/**
 * Show row details
 *
 * @param {ResponsiveDatatablesHelper} responsiveDatatablesHelperInstance instance of ResponsiveDatatablesHelper
 * @param {Object}                     tr                                 jQuery wrapped set
 */
ResponsiveDatatablesHelper.prototype.showRowDetail = function (responsiveDatatablesHelperInstance, tr) {
    // Get column because we need their titles.
    var tableContainer = responsiveDatatablesHelperInstance.tableElement;
    var columns = tableContainer.fnSettings().aoColumns;

    // Create the new tr.
    var newTr = $(responsiveDatatablesHelperInstance.rowTemplate);

    // Get the ul that we'll insert li's into.
    var ul = $('ul', newTr);

    // Loop through hidden columns and create an li for each of them.
    _.each(responsiveDatatablesHelperInstance.columnsHiddenIndexes, function (index) {
        var li = $(responsiveDatatablesHelperInstance.rowLiTemplate);
        $('.columnTitle', li).html(columns[index].sTitle);
        
        var rowIndex = tableContainer.fnGetPosition(tr[0]);
        var aoData = tableContainer.fnSettings().aoData;
        var td = aoData[rowIndex]._anHidden[index];
        // var rowHtml = $(td).html();
        var rowHtml = tableContainer.fnGetTds(rowIndex)[index];
        // li.append(tableContainer.fnGetData(tr[0], index));
        li.append(rowHtml);
        
        ul.append(li);
    });
    $('tbody').on('change', 'tr.row-detail li input', function (e) {
      console.log(this.value);
    })

    // Create tr colspan attribute
    var colspan = responsiveDatatablesHelperInstance.columnIndexes.length - responsiveDatatablesHelperInstance.columnsHiddenIndexes.length;
    newTr.find('> td').attr('colspan', colspan);

    // Append the new tr after the current tr.
    tr.after(newTr);
};

/**
 * Hide row details
 *
 * @param {ResponsiveDatatablesHelper} responsiveDatatablesHelperInstance instance of ResponsiveDatatablesHelper
 * @param {Object}                     tr                                 jQuery wrapped set
 */
ResponsiveDatatablesHelper.prototype.hideRowDetail = function (responsiveDatatablesHelperInstance, tr) {
    tr.next('.row-detail').remove();
};

/**
 * Enable/disable responsive behavior and restores changes made.
 *
 * @param {Boolean} disable, default is true
 */
ResponsiveDatatablesHelper.prototype.disable = function (disable) {
    this.disabled = (disable === undefined) || disable;

    if (this.disabled) {
        // Remove windows resize handler
        this.setWindowsResizeHandler(false);

        // Remove all trs that have row details.
        $('tbody tr.row-detail', this.tableElement).remove();

        // Remove all trs that are marked to have row details shown.
        $('tbody tr', this.tableElement).removeClass('detail-show');

        // Remove all expander icons
        $('tbody tr span.responsiveExpander', this.tableElement).remove();

        this.columnsHiddenIndexes = [];
        this.columnsShownIndexes = this.columnIndexes;
        this.showHideColumns();
        this.tableElement.removeClass('has-columns-hidden');

        this.tableElement.off('click', 'span.responsiveExpander', this.showRowDetailEventHandler);
    } else {
        // Add windows resize handler
        this.setWindowsResizeHandler();
    }
}

'use strict';

$(document).ready(function () {
    var responsiveHelper = undefined;
    var breakpointDefinition = {
        tablet: 1024,
        phone : 480
    };
    var tableElement = $('#example');

    tableElement.dataTable({
        sDom           : '<"row"<"span6"l><"span6"f>r>t<"row"<"span6"i><"span6"p>>',
        sPaginationType: 'bootstrap',
        oLanguage      : {
            sLengthMenu: '_MENU_ records per page'
        },
        // disable sorting on the checkbox column
        aoColumnDefs   : [
            {
                aTargets : [ 0 ],             // Column number which needs to be modified
                bSortable: false,             // Column is not sortable
                // Custom render function - add checkbox
                mRender  : function (data, type) {
                    return '<input type="checkbox" name="id" value="' + data + '" class="checkbox"/>';
                },
                sClass   : 'centered-cell'    // Optional - class to be applied to this table cell
            },
            {
                aTargets: [ 4 ],              // Column number which needs to be modified
                sClass  : 'centered-cell'     // Optional - class to be applied to this table cell
            },
            {
                aTargets: [ 5 ],              // Column number which needs to be modified
                sClass  : 'centered-cell'     // Optional - class to be applied to this table cell
            }
        ],
        bProcessing    : true,
        bAutoWidth     : false,
        sAjaxSource    : 'arrays.txt',
        // Custom call back for AJAX
        fnServerData   : function (sSource, aoData, fnCallback, oSettings) {
            oSettings.jqXHR = $.ajax({
                dataType: 'json',
                type    : 'GET',
                url     : sSource,
                data    : aoData,
                success : function (data) {
                    fnCallback(data);
                }
            });
        },
        fnPreDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper) {
                responsiveHelper = new ResponsiveDatatablesHelper(tableElement, breakpointDefinition);
            }
        },
        fnRowCallback  : function (nRow) {
            responsiveHelper.createExpandIcon(nRow);
        },
        fnDrawCallback : function () {
            // This function will be called every the table redraws.
            // Specifically, we're interested when next/previous page
            // occurs.
            toggleMasterCheckBasedOnAllOtherCheckboxes();

            // Respond to windows resize.
            responsiveHelper.respond();
        },
        fnInitComplete : function (oSettings) {
            initializeMasterCheckboxEventHandler();
            initializeCheckboxEventHandlers();
            initializeTableRowEventHandlers();

            oSettings.aoDestroyCallback.push({
                'sName': 'UnregisterEventHandlers',
                'fn': function () {
                    initializeMasterCheckboxEventHandler(false);
                    initializeCheckboxEventHandlers(false);
                    initializeTableRowEventHandlers(false);
                }
            });
        }
    });

    // NOTE: We did not add class="centered-cell" to the Engine version and CSS grade columns
    //       as in other examples.


    /**
     * Enable master checkbox if there are more than one row in the data table.
     *
     * The enable parameter is used to enable/disable the element.
     *
     * Returns true if enable was successful.
     *
     * @param {Boolean} enable
     * @returns {Boolean}
     */
    function enableMasterCheckbox (enable) {
        enable = enable === undefined ? true : enable;

        if (enable && $('tbody tr', tableElement).length) {
            $('#masterCheck', tableElement).prop('disabled', false);
            return true;
        } else {
            $('#masterCheck', tableElement).prop('disabled', true);
            return false;
        }
    }

    /**
     * Toggles the master checkbox if all checkboxes in the table that
     * are visible are checked.
     */
    function toggleMasterCheckBasedOnAllOtherCheckboxes() {
        // What we need to do here is check to see if every checkbox is checked.
        // If it is, the master checkbox in the header should be checked as well.
        var allCheckboxes = $('tbody input:checkbox', tableElement);
        var totalCheckboxCount = allCheckboxes.length;
        if (totalCheckboxCount) {
            var checkedChecboxCount = allCheckboxes.filter(':checked').length;
            $('#masterCheck', tableElement).prop('checked', totalCheckboxCount === checkedChecboxCount);
        }
    }

    /**
     * Initialize master checkbox event handlers.
     *
     * The on parameter is used to register/unregister the event handler.  The
     * default is true.
     *
     * @param {Boolean} on
     */
    function initializeMasterCheckboxEventHandler(on) {
        on = on === undefined ? true : on;

        if (on) {
            // Enable master checkbox
            enableMasterCheckbox();

            // Register master checkbox to check/uncheck all checkboxes
            $('#masterCheck', tableElement).on('click', function () {
                // Toggle all checkboxes by triggering a click event on them.  The click
                // event will fire the changed event that we can handle.  Directly changing
                // the checked property like this
                //
                //    $('tbody input:checkbox', tableContainer).not(this).prop('checked', this.checked);
                //
                // toggles all checkboxes but does not trigger click events.  Because there's
                // no click event, there's no changed events on the checkboxes.  We need the
                // changed events so that we can keep track of the checked checkboxes.
                if (this.checked) {
                    $('tbody input:checkbox:not(:checked)', tableElement).not(this).trigger('click');
                } else {
                    $('tbody input:checkbox:checked', tableElement).not(this).trigger('click');
                }
            });
        } else {
            // Disable master checkbox
            enableMasterCheckbox(false);

            // Unregister master checkbox to check/uncheck all checkboxes
            $('#masterCheck', tableElement).off('click');
        }
    }

    /**
     * Initialize checkbox event handlers.
     *
     * The on parameter is used to register/unregister the event handler.  The
     * default is true.
     *
     * The elementCollection parameter can be one of the following:
     *     - jQuery collection of checkbox elements
     *     - jQuery selector
     *     - undefined
     *
     * If elementCollection is undefined, all checkboxes in DataTable
     * will be selected.
     *
     * @param {Boolean} on
     * @param {Object|String|undefined} elementCollection
     */
    function initializeCheckboxEventHandlers(on, elementCollection) {
        on = on === undefined ? true : on;

        if (elementCollection === undefined) {
            elementCollection = $('input:checkbox', tableElement.fnGetNodes())
        } else if (elementCollection === 'string') {
            elementCollection = $(elementCollection, tableElement.fnGetNodes())
        }

        if (on) {
            // Register elementCollection handlers
            elementCollection.on('change', function (event) {
                // Keep track of the checked checkboxes.
                if (event.target.checked) {
                    // Do something with the checked item
                    // callSomeFunction(event.target.name, event.target.value);
                    console.log('Checkbox ' + event.target.name + ' checked', event.target.value);
                } else {
                    // Do something with the unchecked item
                    // callSomeFunction(event.target.name, event.target.value);
                    console.log('Checkbox ' + event.target.name + ' unchecked', event.target.value);
                }

                // Affect the other parts of the table/page...
                toggleMasterCheckBasedOnAllOtherCheckboxes();
            });
        } else {
            // Unregister elementCollection handlers
            elementCollection.off('change');
        }
    }

    /**
     * Initialize table row event handler.
     *
     * The on parameter is used to register/unregister the event handler.  The
     * default is true.
     *
     * The elementCollection can be one of the following:
     *     - jQuery collection of checkbox elements
     *     - jQuery selector
     *     - undefined
     *
     * If elementCollection is undefined, all table rows in DataTable
     * will be selected.
     *
     * @param {Boolean} on
     * @param {Object|String|undefined} elementCollection
     */
    function initializeTableRowEventHandlers(on, elementCollection) {
        on = on === undefined ? true : on;

        if (elementCollection === undefined) {
            elementCollection = $(tableElement.fnGetNodes())
        } else if (elementCollection === 'string') {
            elementCollection = $(elementCollection, tableElement.fnGetNodes())
        }

        if (on) {
            // Register elementCollection handlers as needed.
        } else {
            // Unregister elementCollection handlers as needed.
        }
    }
});


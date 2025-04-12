import React from 'react';

const LineItemsTable = ({ lineItems, accountingSummary }) => {
  // Group items with their options and tiered items
  const groupedItems = [];
  let currentGroup = null;

  lineItems.forEach((item) => {
    if (!item.Option && !item.Tiered) {
      // This is a main item (not an option or tiered)
      currentGroup = {
        mainItem: item,
        options: [],
        tieredItems: []
      };
      groupedItems.push(currentGroup);
    } else if (currentGroup) {
      // This is an option or tiered item, add it to current group
      if (item.Option) {
        currentGroup.options.push(item);
      } else if (item.Tiered) {
        currentGroup.tieredItems.push(item);
      }
    } else {
      // Orphan item (shouldn't happen if data is structured properly)
      groupedItems.push({
        mainItem: null,
        options: item.Option ? [item] : [],
        tieredItems: item.Tiered ? [item] : []
      });
    }
  });

  return (
    <div id="lineItems" className="mt-4">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-black text-white print:bg-black print:text-white h-10 items-center">
              <th className="text-center font-medium w-10">#</th>
              <th className="text-left font-medium w-[45%]">Item & Description</th>
              <th className="text-left font-medium">Qty</th>
              <th className="text-left font-medium">Unit</th>
              <th className="text-right font-medium">Piece Price ($)</th>
              <th className="text-right font-medium pr-4">Amount ($)</th>
            </tr>
          </thead>
          <tbody>
            {groupedItems.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-4 text-center text-gray-500">
                  No items added yet.
                </td>
              </tr>
            ) : (
              groupedItems.flatMap((group, groupIndex) => {
                const rows = [];
                const totalSubItems = group.options.length + group.tieredItems.length;
                
                // Add main item row
                if (group.mainItem) {
                  rows.push(
                    <tr 
                      key={`main-${group.mainItem.id}`} 
                      className={totalSubItems > 0 ? "" : "border-b border-gray-600"}
                    >
                      <td className="text-center">{groupIndex + 1}</td>
                      <td className="py-3 pr-4">
                        <div className="font-medium">
                          {`${group.mainItem.Product_Type_Name || ""} - ${group.mainItem.Item || ""}`}
                        </div>
                        <div className="text-sm text-gray-600">
                          {group.mainItem.Description_Rich_Text && (
                            <div dangerouslySetInnerHTML={{ __html: group.mainItem.Description_Rich_Text }} />
                          )}
                        </div>
                      </td>
                      <td className="py-3">{group.mainItem.Qty}</td>
                      <td className="py-3">{group.mainItem.Unit}</td>
                      <td className="py-3 text-right">{parseFloat(group.mainItem.Piece_cost).toFixed(2)}</td>
                      <td className="py-3 text-right pr-4">{group.mainItem.amount}</td>
                    </tr>
                  );
                }

                // Add option items
                group.options.forEach((option, optionIndex) => {
                  const isLastOption = optionIndex === group.options.length - 1 && group.tieredItems.length === 0;
                  rows.push(
                    <tr 
                      key={`option-${option.id}`} 
                      className={isLastOption ? "border-b border-gray-600" : ""}
                    >
                      <td className="text-center"></td>
                      <td className="py-3 pr-4">
                        <div className="font-medium">
                          {`${option.Product_Type_Name || ""} - ${option.Item || ""}`}
                        </div>
                        <div className="text-sm text-gray-600">
                          {option.Description_Rich_Text && (
                            <div dangerouslySetInnerHTML={{ __html: option.Description_Rich_Text }} />
                          )}
                        </div>
                      </td>
                      <td className="py-3">{option.Qty}</td>
                      <td className="py-3">{option.Unit}</td>
                      <td className="py-3 text-right">{parseFloat(option.Piece_cost).toFixed(2)}</td>
                      <td className="py-3 text-right pr-4">{option.amount}</td>
                    </tr>
                  );
                });

                // Add tiered items (with hidden description)
                group.tieredItems.forEach((tiered, tieredIndex) => {
                  const isLastTiered = tieredIndex === group.tieredItems.length - 1;
                  rows.push(
                    <tr 
                      key={`tiered-${tiered.id}`} 
                      className={isLastTiered ? "border-b border-gray-600" : ""}
                    >
                      <td className="text-center"></td>
                      <td className="py-3 pr-4">
                        {/* Empty description for tiered items */}
                      </td>
                      <td className="py-3">{tiered.Qty}</td>
                      <td className="py-3">{tiered.Unit}</td>
                      <td className="py-3 text-right">{parseFloat(tiered.Piece_cost).toFixed(2)}</td>
                      <td className="py-3 text-right pr-4">{tiered.amount}</td>
                    </tr>
                  );
                });

                return rows;
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Totals Section */}
      <div className="mt-3 space-y-2 text-right text-xs">
        <div className="space-x-4">
          <span className="font-semibold">Sub Total ($)</span>
          <span className="w-32 inline-block">{accountingSummary.subTotal}</span>
        </div>
        <div className="space-x-4">
          <span className="font-semibold">Sales Tax ($)</span>
          <span className="w-32 inline-block">{accountingSummary.salesTax}</span>
        </div>
        <div className="space-x-4">
          <span className="font-semibold">Total ($)</span>
          <span className="w-32 inline-block font-bold">{accountingSummary.total}</span>
        </div>
      </div>
    </div>
  );
};

export default LineItemsTable;
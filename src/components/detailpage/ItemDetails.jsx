import React from "react";

const ItemDetails = ({estimate}) => {
  return (
    <div className="flex text-[13px] mt-4">
      {/* Left Column - Addresses */}
      <div className="w-1/3">
        <div className="mb-2">
          <h3 className="font-semibold mb-2">Bill To</h3>
          <div className="text-gray-600">
            <p className="h-4">{estimate.Billing_Name}</p>
            <p className="h-4">{estimate.Bill_To.address_line_1}</p>
            <p className="h-4">
              {estimate.Bill_To.district_city} {estimate.Bill_To.state_province}{" "}
              {estimate.Bill_To.postal_Code}
            </p>
          </div>
        </div>
        <div className="mb-2">
          <h3 className="font-semibold mb-2">Ship To</h3>
          <div className="text-gray-600">
            <p className="h-4">{estimate.Shipping_Name}</p>
            <p className="h-4">{estimate.Ship_To.address_line_2}</p>
            <p className="h-4">
              {estimate.Ship_To.district_city} {estimate.Ship_To.state_province}{" "}
              {estimate.Ship_To.postal_Code}
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - Details */}
      <div className="w-2/3 space-y-4 flex flex-col items-end">
        <div className="flex gap-2">
          <table className="table-auto">
            <tbody>
              <tr className="text-right">
                <td className="py-1 px-4">Quote Date:</td>
                <td className="py-1">{estimate.Quote_date}</td>
              </tr>
              <tr className="text-right">
                <td className="py-1 px-4">Quote Rev #:</td>
                <td className="py-1"></td>
              </tr>
              <tr className="text-right">
                <td className="py-1 px-4">Sales Person:</td>
                <td className="py-1">{estimate.SalespersonName}</td>
              </tr>
              <tr className="text-right">
                <td className="py-1 px-4">Tax Rate:</td>
                <td className="py-1">{estimate.Tax_rate_dropdown}</td>
              </tr>
              <tr className="text-right">
                <td className="py-1 px-4">
                  Lead Time From Approval (Business Days):
                </td>
                <td className="py-1">
                  {estimate.Lead_time_from_approval_Days}
                </td>
              </tr>
              <tr className="text-right">
                <td className="py-1 px-4">Post Production:</td>
                <td className="py-1">{estimate.Post_production}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;

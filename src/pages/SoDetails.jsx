import { useParams, useNavigate } from "react-router-dom";
import { useShippings } from "../context/ShippingContext";

export default function SoDetails() {
  const { id } = useParams();
  const { shippings } = useShippings();
  const navigate = useNavigate();

  const shipping = shippings.find((item) => item.id === Number(id));

  if (!shipping) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-red-500">Shipping not found</div>
        <button
          onClick={() => navigate("/so")}
          className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Back to List
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Shipping Details</h2>
        <div className="space-x-2">
          <button
            onClick={() => navigate(`/so-edit/${id}`)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Edit
          </button>
          <button
            onClick={() => navigate("/so")}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Back to List
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Main Shipping Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Shipping ID:</label>
            <p className="mt-1 p-2 bg-gray-50 rounded">{shipping.shippingId}</p>
          </div>
          <div>
            <label className="block font-medium">Shipping Date:</label>
            <p className="mt-1 p-2 bg-gray-50 rounded">
              {new Date(shipping.shippingDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <label className="block font-medium">Ship Via:</label>
            <p className="mt-1 p-2 bg-gray-50 rounded">{shipping.shipVia}</p>
          </div>
          <div>
            <label className="block font-medium">Account Number:</label>
            <p className="mt-1 p-2 bg-gray-50 rounded">
              {shipping.accountNumber}
            </p>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="border p-4 rounded">
          <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Address Line 1:</label>
              <p className="mt-1 p-2 bg-gray-50 rounded">
                {shipping.address.line1}
              </p>
            </div>
            <div>
              <label className="block font-medium">Address Line 2:</label>
              <p className="mt-1 p-2 bg-gray-50 rounded">
                {shipping.address.line2}
              </p>
            </div>
            <div>
              <label className="block font-medium">City/District:</label>
              <p className="mt-1 p-2 bg-gray-50 rounded">
                {shipping.address.city}
              </p>
            </div>
            <div>
              <label className="block font-medium">State/Province:</label>
              <p className="mt-1 p-2 bg-gray-50 rounded">
                {shipping.address.state}
              </p>
            </div>
            <div>
              <label className="block font-medium">Postal Code:</label>
              <p className="mt-1 p-2 bg-gray-50 rounded">
                {shipping.address.postalCode}
              </p>
            </div>
            <div>
              <label className="block font-medium">Country:</label>
              <p className="mt-1 p-2 bg-gray-50 rounded">
                {shipping.address.country}
              </p>
            </div>
          </div>
        </div>

        {/* Shipping Items */}
        <div className="border p-4 rounded">
          <h3 className="text-lg font-semibold mb-4">Shipping Items</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Item</th>
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-left">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {shipping.items.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2">{item.item}</td>
                    <td className="px-4 py-2">{item.description}</td>
                    <td className="px-4 py-2">{item.qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

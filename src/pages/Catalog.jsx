import React, { useEffect } from 'react';
import initializeApp from '../services/initializeApp';

function getRecord(module, registerID) {  
  console.log("hellooo")
    //Get the record info from where you run the widget tool.
    var record = new Promise(function(resolve, reject) {
      window.ZOHO.CRM.API.getRecord({ Entity: module, RecordID: registerID })
        .then(function (e) {
          var register = e.data[0];
         // var numberID = id[0];
          
          resolve({register: register});
  
        })
        .catch(function (error) {
          reject(error);
        });
    });
  
  
    return record
  
  
  }
const Term = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
          console.log("hiiiiiiiii");
          const data = await initializeApp(); // Await the result of initializeApp
          console.log("Received data from PageLoad:", data);
          const module = data.Entity;
          const registerID = data.EntityId;
          const  result  = await getRecord(module, registerID);
          console.log("r ", result)
         // setData(data); // Store the received data in state
      } catch (error) {
          console.error("Error during initialization:", error);
      }
  };

  fetchData();

}, []);
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">1Source Terms and Conditions</h1>
      <p className="text-gray-700 mb-4">Last Updated: January 28, 2024</p>

      <h2 className="text-xl font-semibold mt-4 mb-2">1. Acceptance of Terms</h2>
      <p className="text-gray-700 mb-4">
        By placing an order with 1Source and all related DBAs, you agree to be bound by the terms and conditions
        outlined herein. These terms may be updated from time to time without notice, and it is your
        responsibility to review them regularly.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">2. Orders and Payments</h2>
      <ol className="list-decimal list-inside mb-4">
        <li>All orders are subject to acceptance by 1Source and all related DBAs.</li>
        <li>Prices are quoted in USD and are exclusive of taxes.</li>
        <li>
          Any changes requested by the client to quantities, specifications, schedule, or other aspects of the
          services described in this estimate are not binding unless accepted by the Company in writing.
          Any requested changes may lead to additional charges, which the client agrees to pay when requesting
          and approving them.
        </li>
        <li>
          We accept payments through ACH, credit card, and check. Acceptable methods of payment include cash,
          check, credit card, and electronic payment. Payment is due within 30 days from the invoice date,
          unless specifically mentioned otherwise on the estimate or invoice. Some projects require 50%
          payment upfront and 50% prior to delivery and will have notes to that effect. Late payments are
          subject to a weekly accruing late charge of 1% of the invoice value or $30, whichever is greater,
          for every week the invoice remains unpaid past its due date.
        </li>
        <li>
          The client is responsible for all applicable federal, state, and local taxes levied on the sale of
          goods described in this estimate. Tax exemptions are provided if a valid tax exemption certificate is
          provided and kept on file with the company. Unless explicitly mentioned, the quoted price does not
          include any taxes, shipping, delivery, or installation charges.
        </li>
      </ol>

      <h2 className="text-xl font-semibold mt-4 mb-2">3. Artwork and Design</h2>
      <ol className="list-decimal list-inside mb-4">
        <li>Customers are responsible for providing print-ready artwork unless otherwise agreed.</li>
        <li>
          1Source and all related DBAs are not liable for any errors in the artwork that were approved by the
          customer.
        </li>
        <li>Additional charges may apply for artwork modifications.</li>
      </ol>

      <h2 className="text-xl font-semibold mt-4 mb-2">4. Lead Times</h2>
      <ol className="list-decimal list-inside mb-4">
        <li>Lead times are estimates and are not guaranteed.</li>
        <li>
          Delays may occur due to factors beyond our control, such as equipment malfunctions or shipping issues.
          All scheduled delivery dates are estimates based on a normal workload, and all deliveries are subject
          to change without liability to the company. Unless expressly specified to the contrary, all shipping
          dates are based upon current availability of materials, present production schedules, and prompt
          receipt of all necessary information.
        </li>
      </ol>

      <h2 className="text-xl font-semibold mt-4 mb-2">5. Shipping and Delivery</h2>
      <ol className="list-decimal list-inside mb-4">
        <li>Shipping costs are the responsibility of the customer unless otherwise specified.</li>
        <li>
          1Source and all related DBAs are not liable for any delays or damages during shipping.
        </li>
        <li>
          Customers are responsible for inspecting the delivered products and reporting any damages within 5 days
          of receipt.
        </li>
      </ol>

      <h2 className="text-xl font-semibold mt-4 mb-2">6. Warranty</h2>
      <ol className="list-decimal list-inside mb-4">
        <li>
          The company warrants its goods to be free from material defects in material and workmanship except:
          <ol className="list-decimal list-inside ml-6">
            <li>
              When goods have been modified following delivery and/or subject to improper handling, storage,
              installation, operation, or maintenance.
            </li>
            <li>
              When an item is purchased by the company as a component part of the goods, except to the extent to
              which such item or items are covered by the warranty, if any, of the original manufacturer.
            </li>
          </ol>
        </li>
      </ol>

      <h2 className="text-xl font-semibold mt-4 mb-2">7. Returns and Refunds</h2>
      <ol className="list-decimal list-inside mb-4">
        <li>Returns will only be accepted for defective or misprinted products.</li>
        <li>
          Customers must notify 1Source and all related DBAs of any issues within 5 days of receiving the
          products.
        </li>
        <li>Refunds or replacements will be issued at the discretion of 1Source and all related DBAs.</li>
      </ol>

      <h2 className="text-xl font-semibold mt-4 mb-2">8. Intellectual Property</h2>
      <ol className="list-decimal list-inside mb-4">
        <li>
          Customers guarantee that they have the right to use any provided artwork or intellectual property.
        </li>
        <li>
          1Source and all related DBAs reserve the right to refuse any order that may infringe on the
          intellectual property rights of others.
        </li>
      </ol>

      <h2 className="text-xl font-semibold mt-4 mb-2">9. Privacy Policy</h2>
      <ol className="list-decimal list-inside mb-4">
        <li>
          1Source and all related DBAs collect and process personal information in accordance with our Privacy
          Policy.
        </li>
        <li>
          Personal information will only be used for order processing and communication purposes.
        </li>
      </ol>

      <h2 className="text-xl font-semibold mt-4 mb-2">10. Limitation of Liability and Indemnification</h2>
      <ol className="list-decimal list-inside mb-4">
        <li>
          1Source and all related DBAs are not liable for any indirect, incidental, or consequential damages.
        </li>
        <li>
          In no event shall our liability exceed the total amount paid by the customer for the products or
          services.
        </li>
        <li>
          The company shall be indemnified and held harmless from and against all claims and causes of action
          for damages and expenses of every kind and character, including costs of suit and reasonable
          attorney's fees, asserted against the company, its agents, and employees arising out of or in any
          manner connected with the product or use of the product listed on the face hereof. This includes,
          but is not limited to, all claims and causes of action resulting from patent or trademark infringement,
          which are based, in whole or in part, on goods manufactured to the client’s specifications.
        </li>
      </ol>

      <h2 className="text-xl font-semibold mt-4 mb-2">11. Payment Default</h2>
      <ol className="list-decimal list-inside mb-4">
        <li>
          Should the client default on any obligation, become insolvent, make an assignment for the benefit of
          creditors, or be subject to any reorganization or bankruptcy proceeding, then the company or its
          representatives may retain or otherwise repossess any part or all of the goods thereof; and the client
          expressly waives all further rights to possession of said product and all claims for injury suffered
          through or loss caused by retention or repossession.
        </li>
        <li>
          If the company shall retain/repossess the product or shall institute any proceeding to recover any
          moneys due, or to recover possession of the product or to enforce any term or condition hereof, the
          client shall pay the company’s cost incurred therein, including attorney's fees and all costs of suit.
        </li>
      </ol>

      <h2 className="text-xl font-semibold mt-4 mb-2">12. Governing Law</h2>
      <p className="text-gray-700 mb-4">
        These terms and conditions are governed by the laws of [Your Jurisdiction], and any disputes will be
        resolved in the courts of Michigan. By placing an order with 1Source and all related DBAs, you
        acknowledge that you have read, understood, and agreed to these terms and conditions.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">AR2 Engineering, LLC DBA:</h2>
      <ul className="list-disc list-inside mb-4">
        <li>1Source</li>
        <li>Screen Works</li>
        <li>Signtext</li>
        <li>Michigan Custom Signs</li>
        <li>King Graphic Systems</li>
        <li>Printnology</li>
      </ul>

      <h2 className="text-xl font-semibold mt-4 mb-2">Contact Information:</h2>
      <p className="text-gray-700 mb-4">AR2 Engineering, LLC</p>
      <p className="text-gray-700 mb-2">26600 Heyn Drive, Novi, MI 48374</p>
      <p className="text-gray-700">Phone: (248) 735-9999</p>
    </div>
  );
};

export default Term;
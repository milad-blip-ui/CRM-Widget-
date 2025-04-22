import React, { useState, useRef, useMemo } from "react";
import JoditEditor from "jodit-react";
import LineItemsTable from "../../components/detailpage/LineItemsTable";
import ItemDetails from "../../components/detailpage/ItemDetails";

const SentToCustomerModal = ({
  item,
  setIsSendModalOpen,
  formData,
  handleChange,
  handleBodyChange,
  handleSubmit,
}) => {
  const editor = useRef(null);

  // Memoize config to prevent unnecessary re-renders
  const config = useMemo(
    () => ({
      readonly: false,
      height: 300,
      buttons: [
        "bold",
        "italic",
        "underline",
        "fontsize",
        "link", // Make sure this is included
        "font",
        "brush",
        "ul",
        "ol",
        "|",
        "align",
        "undo",
        "redo",
      ],
      // Link specific settings
      link: {
        noFollowCheckbox: true, // Show nofollow checkbox
        openInNewTabCheckbox: true, // Show "open in new tab" option
        mode: "dialog", // 'dialog' or 'inline' editor
        defaultProtocol: "https://", // Default protocol
      },
      disablePlugins: ["paste", "pasteStorage", "image"],
      showXPathInStatusbar: false,
      toolbarAdaptive: false,
      statusbar: false, // This hides the entire footer including character count
      controls: {
        fontsize: {
          list: [
            "8",
            "9",
            "10",
            "11",
            "12",
            "14",
            "16",
            "18",
            "24",
            "30",
            "36",
          ]
        },
        font: {
          command: "fontname",
          list: {
            Arial: "Arial",
            "Times New Roman": "Times New Roman",
            "Courier New": "Courier New",
            Georgia: "Georgia",
            Verdana: "Verdana",
          },
        },
        brush: {
          colors: [
            "#000000",
            "#FFFFFF",
            "#FF0000",
            "#00FF00",
            "#0000FF",
            "#FFFF00",
            "#00FFFF",
            "#FF00FF",
            "#FFA500",
            "#A52A2A",
            "#800080",
            "#008000",
            "#808000",
            "#800000",
            "#008080",
            "#000080",
          ],
          mode: 1,
        },
      },
    }),
    []
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white max-w-5xl w-full max-h-[90vh] flex flex-col overflow-auto">
        {/* Fixed Header */}
        <div className="sticky top-0 bg-white z-10 p-3 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium">Send Estimate</h3>
          <button
            onClick={() => setIsSendModalOpen(false)}
            className="text-red-500 hover:text-red-700 focus:outline-none"
            aria-label="Close modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-8 pb-2">
            <div className="mb-4 flex items-center">
              <label
                htmlFor="additionalRecipient"
                className="text-sm font-medium text-gray-700 w-1/4"
              >
                Additional Recipient:
              </label>
              <input
                type="text"
                id="additionalRecipient"
                name="additionalRecipient"
                value={formData.additionalRecipient}
                onChange={handleChange}
                className="input-box w-full ml-2"
                placeholder="Enter email address"
              />
            </div>

            <div className="mb-4 flex items-center">
              <label
                htmlFor="subject"
                className="text-sm font-medium text-gray-700 w-1/4"
              >
                Subject:
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="input-box ml-2 w-full"
                placeholder="Email subject"
                required
              />
            </div>

            <div className="mb-6 flex">
              <label
                htmlFor="body"
                className="text-sm font-medium text-gray-700 w-1/4 pt-2"
              >
                Body:
              </label>
              <div className="w-full ml-2">
                <JoditEditor
                  ref={editor}
                  value={formData.body}
                  config={config}
                  onChange={handleBodyChange}
                  tabIndex={1} // Important for focus management
                />
              </div>
            </div>
          </div>
          <div className='bg-gray-50 mt-4 py-12 bg-[url("https://creatorapp.zohopublic.com/sst1source/source-erp/report/All_Brands/4599841000000958005/Logo/download-file/QThHrb7wD3fTJUPXBRwtZH4d7PmRzJyDK8DNeO9EvN0ewxJMQPJTav3N3AW1vmq6FVszHVg9zpnZZNfBQDPFd4ej4CbNj49Rnapa?filepath=/1726822583522_1SourceLogo.jpg&mediaType=1&digestValue=eyJkaWdlc3RWYWx1ZSI6MTcyNTY1MzE3MzY4NCwibGFuZ3VhZ2UiOiJlbiJ9")] bg-contain bg-no-repeat bg-center h-10'></div>

          <div className="flex items-center justify-center text-xs font-semibold text-gray-800">
            <p>
              A family of companies: Screen Works | Michigan Custom Signs |
              Signtext | Printnology | King Graphic Systems | CA Marketing
            </p>
          </div>

          <div className="flex flex-col justify-end items-end px-10">
            <h1 className="text-3xl">Quote</h1>
            <p># {item.Quote}</p>
          </div>

          <div className="px-8">
            <ItemDetails estimate={item} />
            <h1 className="mt-2">Quote Name: {item.Quote_name}</h1>
            <LineItemsTable
              lineItems={item.Item_Details}
              accountingSummary={item.Accounting_Summary}
            />
            <hr className="mt-4 border-b-0 border-gray-800" />
            <div className="text-xs text-gray-900 mt-1 pl-3">
              <a href="" className="">
                Click Here For Terms & Conditions
              </a>
              <br />
              <br />
              26600 Heyn Drive, Novi, MI, 48374, United States | +12487359999 |
              www.the1source.com
              <p className="mt-6">
                ISO 9001 Registered| Minority Business Enterprise
              </p>
              <br />
              <br />
              <br />
            </div>
            <div className="flex justify-end space-x-3 mt-10 mb-10">
              <button
                onClick={() => setIsSendModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Send Estimate
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SentToCustomerModal;

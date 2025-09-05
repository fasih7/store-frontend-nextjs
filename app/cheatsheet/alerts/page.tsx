"use client";
import { useState } from "react";
import {
  AlertDialog,
  AlertType,
  useAlert,
} from "../../../components/shared/alerts";

const AlertDemo: React.FC = () => {
  // Method 1: Using the custom hook (recommended)
  const {
    alert,
    hideAlert,
    showError,
    showSuccess,
    showWarning,
    showInfo,
    showConfirm,
  } = useAlert();

  // Method 2: Using component state directly
  const [simpleAlert, setSimpleAlert] = useState<{
    isOpen: boolean;
    type: AlertType;
    title: string;
    description: string;
  }>({
    isOpen: false,
    type: "info",
    title: "",
    description: "",
  });

  const handleAsyncOperation = async (): Promise<void> => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showSuccess("Success!", "Your data has been saved successfully.");
    } catch (error) {
      showError("Error!", "Failed to save your data. Please try again.");
    }
  };

  const handleDelete = (): void => {
    showConfirm(
      "Delete Item",
      "Are you sure you want to delete this item? This action cannot be undone.",
      () => {
        showSuccess("Deleted!", "The item has been successfully deleted.");
      },
      {
        confirmText: "Delete",
        cancelText: "Keep",
      }
    );
  };

  const showSimpleAlert = (): void => {
    setSimpleAlert({
      isOpen: true,
      type: "info",
      title: "Simple Alert",
      description: "This is using direct component state!",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          TypeScript Alert Dialog Component
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Fully typed - No providers needed - Just import and use!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          onClick={() =>
            showError(
              "Oops!",
              "Something went wrong. Please check your input and try again."
            )
          }
          className="p-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
        >
          Show Error Alert
        </button>

        <button
          onClick={() =>
            showSuccess("Great!", "Your changes have been saved successfully.")
          }
          className="p-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
        >
          Show Success Alert
        </button>

        <button
          onClick={() =>
            showWarning(
              "Warning!",
              "This action may have unintended consequences."
            )
          }
          className="p-4 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors"
        >
          Show Warning Alert
        </button>

        <button
          onClick={() =>
            showInfo("Information", "Here is some helpful information for you.")
          }
          className="p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          Show Info Alert
        </button>

        <button
          onClick={handleDelete}
          className="p-4 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
        >
          Show Confirmation
        </button>

        <button
          onClick={showSimpleAlert}
          className="p-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
        >
          Simple Component State
        </button>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          TypeScript Usage Examples
        </h2>
        <div className="space-y-4 text-sm">
          <div className="bg-white dark:bg-gray-700 p-4 rounded border">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              Method 1: Using the hook (Recommended)
            </h3>
            <code className="text-gray-800 dark:text-gray-200 block whitespace-pre">
              {`const { alert, hideAlert, showError } = useAlert();
  
  // Show alert
  showError('Error!', 'Something went wrong.');
  
  // Render component
  <AlertDialog {...alert} onClose={hideAlert} />`}
            </code>
          </div>

          <div className="bg-white dark:bg-gray-700 p-4 rounded border">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              Method 2: Direct component usage
            </h3>
            <code className="text-gray-800 dark:text-gray-200 block whitespace-pre">
              {`const [isOpen, setIsOpen] = useState<boolean>(false);
  
  <AlertDialog
    isOpen={isOpen}
    type="error"
    title="Error!"
    description="Something went wrong."
    onClose={() => setIsOpen(false)}
  />`}
            </code>
          </div>

          <div className="bg-white dark:bg-gray-700 p-4 rounded border">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              Confirmation Dialog
            </h3>
            <code className="text-gray-800 dark:text-gray-200 block whitespace-pre">
              {`<AlertDialog
    isOpen={true}
    type="warning"
    title="Delete Item?"
    description="This cannot be undone."
    showCancel={true}
    confirmText="Delete"
    cancelText="Keep"
    onConfirm={() => handleDelete()}
    onClose={() => setIsOpen(false)}
  />`}
            </code>
          </div>
        </div>
      </div>

      {/* Alert Dialogs */}
      <AlertDialog {...alert} onClose={hideAlert} />

      <AlertDialog
        isOpen={simpleAlert.isOpen}
        type={simpleAlert.type}
        title={simpleAlert.title}
        description={simpleAlert.description}
        onClose={() => setSimpleAlert((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

export default AlertDemo;

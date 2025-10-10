import React, { useState } from "react";
import { CheckCircle2, Plus, X, Gift, Trash2 } from "lucide-react";
import { Bonus, Payment, SalaryAnalticsState } from "@/types/global";

interface PaycheckDetailsProps {
  salary: SalaryAnalticsState;
  bonuses?: Bonus[];
  payments?: Payment[];
  onMarkAsPaid?: (paymentData: Payment) => void;
  onAddBonus?: (bonusData: Bonus) => void;
  onRemoveBonus?: (bonusDate: string) => void;
}

const PaycheckDetails: React.FC<PaycheckDetailsProps> = ({
  salary,
  bonuses = [],
  payments = [],
  onMarkAsPaid,
  onAddBonus,
  onRemoveBonus,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [pendingPaymentData, setPendingPaymentData] = useState<{
    date: { fromDate: string; toDate: string };
    amount: string;
  } | null>(null);
  const [formData, setFormData] = useState<Bonus>({
    date: "",
    description: "",
    amount: 0,
  });

  // Calculate date range
  const getDateRange = () => {
    const today = new Date().toISOString().split("T")[0];

    if (payments.length === 0) {
      return { fromDate: "N/A", toDate: today };
    }

    // Get the last payment's "to" date as the new "from" date
    const lastPayment = payments[payments.length - 1];

    const lastToDate = new Date(lastPayment.to);

    return {
      fromDate: lastToDate.toISOString().split("T")[0],
      toDate: today,
    };
  };

  const { fromDate, toDate } = getDateRange();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleSubmit = () => {
    if (
      onAddBonus &&
      formData.date &&
      formData.description &&
      formData.amount
    ) {
      onAddBonus(formData);
      setIsDialogOpen(false);
      setFormData({ date: "", description: "", amount: 0 });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "amount" ? parseFloat(value) || 0 : value,
    });
  };

  const handleRemoveBonus = (bonusDate: string) => {
    if (onRemoveBonus) {
      onRemoveBonus(bonusDate);
    }
  };

  const handleMarkAsPaid = (data: {
    date: { fromDate: string; toDate: string };
    amount: string;
  }) => {
    // Store the payment data and show confirmation dialog
    setPendingPaymentData(data);
    setIsConfirmDialogOpen(true);
  };

  const confirmMarkAsPaid = () => {
    if (onMarkAsPaid && pendingPaymentData) {
      onMarkAsPaid({
        from: pendingPaymentData.date.fromDate,
        to: pendingPaymentData.date.toDate,
        amount: Number(pendingPaymentData.amount),
      });
    }
    setIsConfirmDialogOpen(false);
    setPendingPaymentData(null);
  };

  const cancelMarkAsPaid = () => {
    setIsConfirmDialogOpen(false);
    setPendingPaymentData(null);
  };

  return (
    <>
      <div className="shadow-md rounded-xl p-4 sm:p-6 w-full mx-auto bg-white">
        <h4 className="mb-4 font-semibold text-lg border-b border-black/20 pb-2">
          Paycheck Details ({formatDate(fromDate)} to {formatDate(toDate)})
        </h4>

        <div className="space-y-3 sm:space-y-4">
          <p className="text-sm sm:text-base flex justify-between">
            <span className="font-semibold">Gross Salary:</span>
            <span className="text-right">
              ₹{parseFloat(salary.grossSalary).toLocaleString()}
            </span>
          </p>

          <p className="text-sm sm:text-base flex justify-between">
            <span className="font-semibold">Full Day Salary:</span>
            <span className="text-right">
              ₹{parseFloat(salary.fullDaySalary).toLocaleString()}
            </span>
          </p>

          <p className="text-sm sm:text-base flex justify-between">
            <span className="font-semibold">Half Day Salary:</span>
            <span className="text-right">
              ₹{parseFloat(salary.halfDayPresentSalary).toLocaleString()}
            </span>
          </p>

          <p className="text-sm sm:text-base flex justify-between">
            <span className="font-semibold">Paid Holiday Salary:</span>
            <span className="text-right">
              ₹{parseFloat(salary.paidHolidaySalary).toLocaleString()}
            </span>
          </p>

          <p className="text-sm sm:text-base flex justify-between">
            <span className="font-semibold">Working Holiday Salary:</span>
            <span className="text-right">
              ₹{parseFloat(salary.totalWorkingHolidaySalary).toLocaleString()}
            </span>
          </p>

          <p className="text-sm sm:text-base flex justify-between border-t border-black/10 pt-3">
            <span className="font-semibold">Total Bonus:</span>
            <span className="text-right text-blue-600 font-semibold">
              +₹{parseFloat(salary.totalBonus).toLocaleString()}
            </span>
          </p>

          <p className="text-base sm:text-lg flex justify-between border-t-2 border-black/20 pt-3">
            <span className="font-bold">Net Salary:</span>
            <span className="text-right font-bold text-green-600 text-lg">
              ₹{parseFloat(salary.totalSalary).toLocaleString()}
            </span>
          </p>
        </div>

        {/* Bonus Details */}
        {bonuses && bonuses.length > 0 && (
          <div className="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-5 border border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <h5 className="font-bold text-base sm:text-lg flex items-center gap-2 text-gray-800">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Gift className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                Applied Bonuses
              </h5>
              <span className="text-xs sm:text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                {bonuses.length} {bonuses.length === 1 ? "Bonus" : "Bonuses"}
              </span>
            </div>
            <div className="space-y-3">
              {bonuses.map((bonus, index) => (
                <div
                  key={bonus._id || index}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-4 bg-white rounded-lg shadow-sm border border-blue-100 hover:shadow-md transition-all duration-200">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start gap-2">
                      <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-blue-600 bg-blue-100 rounded-full flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm sm:text-base font-semibold text-gray-900 leading-tight">
                          {bonus.description}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1 flex items-center gap-1">
                          <svg
                            className="w-3 h-3 sm:w-4 sm:h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          {formatDate(bonus.date)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 sm:gap-3">
                    <span className="text-base sm:text-lg font-bold text-green-600 bg-green-50 px-3 sm:px-4 py-2 rounded-lg border border-green-200">
                      +₹{bonus.amount.toLocaleString()}
                    </span>
                    {onRemoveBonus && (
                      <button
                        onClick={() => handleRemoveBonus(bonus.date)}
                        className="p-2 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white rounded-lg transition-all duration-200 border border-red-200 hover:border-red-500 flex-shrink-0"
                        title="Remove bonus">
                        <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-blue-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">
                  Total Bonus Amount:
                </span>
                <span className="text-lg font-bold text-blue-600">
                  ₹
                  {bonuses
                    .reduce((sum, bonus) => sum + bonus.amount, 0)
                    .toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            onClick={() => setIsDialogOpen(true)}
            className="text-xs sm:text-sm cursor-pointer transition-all bg-blue-500 text-white px-6 py-3 rounded-lg border-blue-600 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] flex gap-2 items-center justify-center flex-1 font-bold">
            <Plus className="h-4 w-4 sm:h-5 sm:w-5" /> Add Bonus
          </button>

          {onMarkAsPaid && (
            <button
              onClick={() =>
                handleMarkAsPaid({
                  date: getDateRange(),
                  amount: salary.totalSalary,
                })
              }
              className="text-xs sm:text-sm cursor-pointer transition-all bg-yellow-400 text-white px-6 py-3 rounded-lg border-yellow-500 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] flex gap-2 items-center justify-center flex-1 font-bold">
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" /> Mark as Paid
            </button>
          )}
        </div>
      </div>

      {/* Add Bonus Dialog Overlay */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            {/* Dialog Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Add Bonus</h3>
              <button
                onClick={() => setIsDialogOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Dialog Content */}
            <div className="p-6">
              <div className="space-y-4">
                {/* Date Field */}
                <div>
                  <label
                    htmlFor="date"
                    className="block text-sm font-semibold text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={fromDate}
                    max={toDate}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>

                {/* Description Field */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Enter bonus description..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                  />
                </div>

                {/* Amount Field */}
                <div>
                  <label
                    htmlFor="amount"
                    className="block text-sm font-semibold text-gray-700 mb-2">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount || ""}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
              </div>

              {/* Dialog Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold">
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={
                    !formData.date || !formData.description || !formData.amount
                  }
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
                  Add Bonus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog Overlay */}
      {isConfirmDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            {/* Dialog Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Confirm Payment</h3>
              <button
                onClick={cancelMarkAsPaid}
                className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Dialog Content */}
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-center text-yellow-500 mb-4">
                  <CheckCircle2 className="h-16 w-16" />
                </div>
                
                <p className="text-center text-gray-700 font-semibold">
                  Are you sure you want to mark this paycheck as paid?
                </p>
                
                {pendingPaymentData && (
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <p className="text-sm flex justify-between">
                      <span className="font-semibold">Period:</span>
                      <span>{formatDate(pendingPaymentData.date.fromDate)} to {formatDate(pendingPaymentData.date.toDate)}</span>
                    </p>
                    <p className="text-sm flex justify-between">
                      <span className="font-semibold">Amount:</span>
                      <span className="font-bold text-green-600">
                        ₹{parseFloat(pendingPaymentData.amount).toLocaleString()}
                      </span>
                    </p>
                  </div>
                )}
                
                <p className="text-center text-sm text-gray-500 mt-2">
                  This action cannot be undone.
                </p>
              </div>

              {/* Dialog Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={cancelMarkAsPaid}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold">
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmMarkAsPaid}
                  className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition font-semibold">
                  Confirm Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PaycheckDetails;
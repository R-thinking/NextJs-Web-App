export const styles = {
  // Form elements
  input:
    "mt-1 block w-full rounded-md border border-gray-400 shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-600 placeholder:font-medium text-black text-sm sm:text-base font-medium",
  formLabel: "block text-xs sm:text-sm font-bold text-black",

  // Buttons
  primaryButton:
    "bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
  secondaryButton:
    "font-medium text-sm sm:text-base border border-gray-400 bg-white text-black shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400",
  dangerButton:
    "bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500",

  // Table styles
  tableHeader:
    "px-3 py-2 sm:px-6 text-left text-2xs sm:text-xs font-bold text-black uppercase tracking-wider",
  tableCell:
    "px-3 py-2 sm:px-6 sm:py-3 whitespace-nowrap overflow-hidden text-ellipsis",
  tableCellText:
    "font-medium text-2xs sm:text-sm text-black truncate block w-full max-w-full",
  responsiveTable:
    "w-full overflow-x-auto scrollbar-thin pb-2 -mx-3 sm:mx-0 px-3 touch-pan-x",

  // Card styles
  card: "bg-white rounded-lg shadow-lg overflow-hidden max-w-full mx-auto",
  cardHeader:
    "flex flex-col sm:flex-row justify-between items-center p-4 border-b gap-4",

  // Modal styles
  modalContainer:
    "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4",
  modalContent: "bg-white rounded-lg px-0 py-4  m-4 max-w-md mx-auto w-full",
};

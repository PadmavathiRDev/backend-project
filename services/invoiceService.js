const PDFDocument = require("pdfkit");
const fs = require("fs");

exports.generateInvoice = (data, filePath) => {
  const doc = new PDFDocument();

  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(18).text("STACKLY - Invoice", { align: "center" });

  doc.moveDown();
  doc.fontSize(12).text(`Invoice ID: ${data.invoiceId}`);
  doc.text(`Date: ${data.date}`);
  doc.text(`Plan: ${data.plan}`);
  doc.text(`Amount: ₹${data.amount / 100}`);
  doc.text(`Status: Paid`);

  doc.end();
};

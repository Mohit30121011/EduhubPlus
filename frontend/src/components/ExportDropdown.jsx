import { useState, useRef, useEffect } from 'react';
import { Download, FileText, FileSpreadsheet, File, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const ExportDropdown = ({ data, columns, filename = 'export', title = 'Data Export', circular = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [position, setPosition] = useState({ top: 0, left: 0 });

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Helper to access nested keys (e.g., "familyDetails.father.name")
    const getNestedValue = (obj, path) => {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };

    // Export as CSV
    const exportCSV = () => {
        const headers = columns.map(col => col.header || col.key);

        const csvContent = [
            headers.join(','),
            ...data.map(row =>
                columns.map(col => {
                    let value = getNestedValue(row, col.key);
                    if (typeof value === 'object') value = JSON.stringify(value); // Handle arrays/objects
                    if (typeof value === 'string' && value.includes(',')) {
                        value = `"${value}"`;
                    }
                    return value || '';
                }).join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${filename}.csv`;
        link.click();
        setIsOpen(false);
    };

    // Export as Excel
    const exportExcel = () => {
        const headers = columns.map(col => col.header || col.key);

        const wsData = [
            headers,
            ...data.map(row => columns.map(col => getNestedValue(row, col.key) || ''))
        ];

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(wsData);

        // Set column widths
        ws['!cols'] = columns.map(() => ({ wch: 20 }));

        XLSX.utils.book_append_sheet(wb, ws, 'Data');
        XLSX.writeFile(wb, `${filename}.xlsx`);
        setIsOpen(false);
    };

    // Export as styled PDF
    const exportPDF = () => {
        const doc = new jsPDF();
        const headers = columns.map(col => col.header || col.key);

        // Add title with gradient-like effect
        doc.setFillColor(59, 130, 246); // Blue
        doc.rect(0, 0, 220, 30, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text(title, 14, 20);

        // Add date
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Generated: ${new Date().toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}`, 14, 40);

        // Prepare table data
        const tableData = data.map(row =>
            columns.map(col => getNestedValue(row, col.key) || '-')
        );

        // Add styled table
        doc.autoTable({
            head: [headers],
            body: tableData,
            startY: 50,
            theme: 'grid',
            headStyles: {
                fillColor: [31, 41, 55], // Gray-800
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                fontSize: 10,
                cellPadding: 5,
                halign: 'left'
            },
            bodyStyles: {
                fontSize: 9,
                cellPadding: 4,
                textColor: [55, 65, 81], // Gray-700
                lineColor: [229, 231, 235], // Gray-200
                lineWidth: 0.5
            },
            alternateRowStyles: {
                fillColor: [249, 250, 251] // Gray-50
            },
            columnStyles: columns.reduce((acc, col, index) => {
                acc[index] = { cellWidth: 'auto' };
                return acc;
            }, {}),
            margin: { left: 14, right: 14 },
            didDrawPage: (data) => {
                // Add footer
                doc.setFontSize(8);
                doc.setTextColor(156, 163, 175);
                doc.text(
                    `Page ${doc.internal.getNumberOfPages()}`,
                    doc.internal.pageSize.width / 2,
                    doc.internal.pageSize.height - 10,
                    { align: 'center' }
                );
            }
        });

        doc.save(`${filename}.pdf`);
        setIsOpen(false);
    };

    const options = [
        { label: 'CSV File', icon: FileText, action: exportCSV, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Excel File', icon: FileSpreadsheet, action: exportExcel, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'PDF File', icon: File, action: exportPDF, color: 'text-red-600', bg: 'bg-red-50' }
    ];

    // Open Handler with positioning logic
    const toggleOpen = () => {
        if (!isOpen && dropdownRef.current) {
            const rect = dropdownRef.current.getBoundingClientRect();
            // Position: below the button, aligned to the right edge
            // Left = rect.right - 200 (approx width of dropdown)
            // Or simpler: Left = rect.left + (rect.width/2) - (dropdownWidth/2)
            // Let's safe-align to bottom-right of button
            setPosition({
                top: rect.bottom + 8,
                left: rect.right - 200
            });
        }
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <motion.button
                onClick={toggleOpen}
                whileHover={{ scale: circular ? 1.1 : 1.02 }}
                whileTap={{ scale: circular ? 0.9 : 0.98 }}
                className={circular
                    ? "w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full flex items-center justify-center transition-all"
                    : "px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-sm flex items-center gap-2 transition-colors"
                }
                title="Export"
            >
                <Download size={18} />
                {!circular && (
                    <>
                        Export
                        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </>
                )}
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        style={{
                            position: 'fixed',
                            top: position.top,
                            left: position.left,
                            zIndex: 9999
                        }}
                        className="w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                    >
                        {options.map((option, index) => (
                            <button
                                key={index}
                                onClick={option.action}
                                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                            >
                                <div className={`p-2 rounded-lg ${option.bg}`}>
                                    <option.icon size={16} className={option.color} />
                                </div>
                                <span className="text-sm font-medium text-gray-700">{option.label}</span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ExportDropdown;

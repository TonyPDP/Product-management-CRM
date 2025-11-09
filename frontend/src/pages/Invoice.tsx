import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Search,
  Plus,
  Download,
  Eye,
  Edit,
  Trash2,
  Send,
  FileText,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Filter,
  X,
} from "lucide-react";

// Types
interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  subtotal: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  issueDate: string;
  dueDate: string;
  status: "draft" | "sent" | "paid" | "overdue";
  lineItems: LineItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes: string;
  paymentMethod: string;
  paidAmount: number;
  userId: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
}

// Mock Data
const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "C001",
    name: "John Smith",
    email: "john@example.com",
    company: "Tech Corp",
    phone: "+1234567890",
  },
  {
    id: "C002",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    company: "Design Studio",
    phone: "+1234567891",
  },
  {
    id: "C003",
    name: "Mike Brown",
    email: "mike@example.com",
    company: "Marketing Inc",
    phone: "+1234567892",
  },
];

const MOCK_INVOICES: Invoice[] = [
  {
    id: "INV001",
    invoiceNumber: "INV-2024-001",
    customerId: "C001",
    customerName: "John Smith",
    customerEmail: "john@example.com",
    issueDate: "2024-11-01",
    dueDate: "2024-11-15",
    status: "paid",
    lineItems: [
      {
        id: "1",
        description: "Web Development",
        quantity: 1,
        unitPrice: 5000,
        tax: 10,
        subtotal: 5000,
      },
      {
        id: "2",
        description: "UI/UX Design",
        quantity: 1,
        unitPrice: 3000,
        tax: 10,
        subtotal: 3000,
      },
    ],
    subtotal: 8000,
    tax: 800,
    total: 8800,
    notes: "Thank you for your business!",
    paymentMethod: "Bank Transfer",
    paidAmount: 8800,
    userId: "user1",
  },
  {
    id: "INV002",
    invoiceNumber: "INV-2024-002",
    customerId: "C002",
    customerName: "Sarah Johnson",
    customerEmail: "sarah@example.com",
    issueDate: "2024-11-04",
    dueDate: "2024-10-20",
    status: "overdue",
    lineItems: [
      {
        id: "1",
        description: "Logo Design",
        quantity: 1,
        unitPrice: 2000,
        tax: 10,
        subtotal: 2000,
      },
    ],
    subtotal: 2000,
    tax: 200,
    total: 2200,
    notes: "",
    paymentMethod: "Credit Card",
    paidAmount: 0,
    userId: "user1",
  },
  {
    id: "INV003",
    invoiceNumber: "INV-2024-003",
    customerId: "C003",
    customerName: "Mike Brown",
    customerEmail: "mike@example.com",
    issueDate: "2024-11-03",
    dueDate: "2024-11-17",
    status: "sent",
    lineItems: [
      {
        id: "1",
        description: "SEO Services",
        quantity: 1,
        unitPrice: 1500,
        tax: 10,
        subtotal: 1500,
      },
      {
        id: "2",
        description: "Content Writing",
        quantity: 5,
        unitPrice: 200,
        tax: 10,
        subtotal: 1000,
      },
    ],
    subtotal: 2500,
    tax: 250,
    total: 2750,
    notes: "Payment due within 14 days",
    paymentMethod: "PayPal",
    paidAmount: 0,
    userId: "user1",
  },
];

const InvoiceCRM = () => {
  const [view, setView] = useState<"list" | "create" | "edit" | "detail">(
    "list"
  );
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null);

  // Form state for create/edit
  const [formData, setFormData] = useState({
    customerId: "",
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    notes: "",
    paymentMethod: "Bank Transfer",
    lineItems: [
      { id: "1", description: "", quantity: 1, unitPrice: 0, tax: 10 },
    ] as any[],
  });

  // Storage helper
  const storage = {
    async set(key: string, value: string) {
      if (window.storage) {
        return await window.storage.set(key, value);
      }
      return Promise.resolve();
    },
    async get(key: string) {
      if (window.storage) {
        try {
          const result = await window.storage.get(key);
          return result ? { value: result.value } : null;
        } catch (error) {
          return null;
        }
      }
      return null;
    },
    async delete(key: string) {
      if (window.storage) {
        return await window.storage.delete(key);
      }
      return Promise.resolve();
    },
    async list(prefix: string) {
      if (window.storage) {
        try {
          return await window.storage.list(prefix);
        } catch (error) {
          return { keys: [] };
        }
      }
      return { keys: [] };
    },
  };

  // Load invoices on mount
  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const result = await storage.list("invoice:");
      if (result && result.keys && result.keys.length > 0) {
        const loadedInvoices = await Promise.all(
          result.keys.map(async (key) => {
            try {
              const data = await storage.get(key);
              return data ? JSON.parse(data.value) : null;
            } catch (error) {
              return null;
            }
          })
        );
        const validInvoices = loadedInvoices.filter((inv) => inv !== null);
        setInvoices(validInvoices);
      } else {
        // Load mock data on first run
        setInvoices(MOCK_INVOICES);
        MOCK_INVOICES.forEach(async (invoice) => {
          await storage.set(`invoice:${invoice.id}`, JSON.stringify(invoice));
        });
      }
    } catch (error) {
      setInvoices(MOCK_INVOICES);
    }
  };

  // Filter invoices
  useEffect(() => {
    let filtered = invoices;

    if (searchQuery) {
      filtered = filtered.filter(
        (inv) =>
          inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inv.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((inv) => inv.status === statusFilter);
    }

    setFilteredInvoices(filtered);
  }, [searchQuery, statusFilter, invoices]);

  // Update invoice status based on due date
  useEffect(() => {
    const checkOverdue = () => {
      const today = new Date().toISOString().split("T")[0];
      invoices.forEach(async (invoice) => {
        if (invoice.status === "sent" && invoice.dueDate < today) {
          const updated = { ...invoice, status: "overdue" as const };
          await storage.set(`invoice:${invoice.id}`, JSON.stringify(updated));
          setInvoices((prev) =>
            prev.map((inv) => (inv.id === invoice.id ? updated : inv))
          );
        }
      });
    };
    checkOverdue();
    const interval = setInterval(checkOverdue, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [invoices]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "sent":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "overdue":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-4 w-4" />;
      case "sent":
        return <Send className="h-4 w-4" />;
      case "draft":
        return <FileText className="h-4 w-4" />;
      case "overdue":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear();
    const count = invoices.length + 1;
    return `INV-${year}-${String(count).padStart(3, "0")}`;
  };

  const calculateLineItem = (item: any) => {
    const subtotal = item.quantity * item.unitPrice;
    return {
      ...item,
      subtotal,
    };
  };

  const calculateTotals = (items: any[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = items.reduce(
      (sum, item) => sum + (item.subtotal * item.tax) / 100,
      0
    );
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const handleCreateInvoice = async () => {
    const customer = customers.find((c) => c.id === formData.customerId);
    if (!customer) {
      alert("Please select a customer");
      return;
    }

    const calculatedItems = formData.lineItems.map(calculateLineItem);
    const { subtotal, tax, total } = calculateTotals(calculatedItems);

    const newInvoice: Invoice = {
      id: `INV${Date.now()}`,
      invoiceNumber: generateInvoiceNumber(),
      customerId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email,
      issueDate: formData.issueDate,
      dueDate: formData.dueDate,
      status: "draft",
      lineItems: calculatedItems,
      subtotal,
      tax,
      total,
      notes: formData.notes,
      paymentMethod: formData.paymentMethod,
      paidAmount: 0,
      userId: "user1",
    };

    await storage.set(`invoice:${newInvoice.id}`, JSON.stringify(newInvoice));
    setInvoices([...invoices, newInvoice]);
    resetForm();
    setView("list");
    showToast("Invoice created successfully!");
  };

  const handleUpdateInvoice = async () => {
    if (!selectedInvoice) return;

    const customer = customers.find((c) => c.id === formData.customerId);
    if (!customer) return;

    const calculatedItems = formData.lineItems.map(calculateLineItem);
    const { subtotal, tax, total } = calculateTotals(calculatedItems);

    const updatedInvoice: Invoice = {
      ...selectedInvoice,
      customerId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email,
      issueDate: formData.issueDate,
      dueDate: formData.dueDate,
      lineItems: calculatedItems,
      subtotal,
      tax,
      total,
      notes: formData.notes,
      paymentMethod: formData.paymentMethod,
    };

    await storage.set(
      `invoice:${updatedInvoice.id}`,
      JSON.stringify(updatedInvoice)
    );
    setInvoices(
      invoices.map((inv) =>
        inv.id === updatedInvoice.id ? updatedInvoice : inv
      )
    );
    resetForm();
    setView("list");
    showToast("Invoice updated successfully!");
  };

  const handleDeleteInvoice = async (id: string) => {
    await storage.delete(`invoice:${id}`);
    setInvoices(invoices.filter((inv) => inv.id !== id));
    setShowDeleteModal(false);
    setInvoiceToDelete(null);
    showToast("Invoice deleted successfully!");
  };

  const handleMarkAsPaid = async (invoice: Invoice) => {
    const updated = {
      ...invoice,
      status: "paid" as const,
      paidAmount: invoice.total,
    };
    await storage.set(`invoice:${invoice.id}`, JSON.stringify(updated));
    setInvoices(invoices.map((inv) => (inv.id === invoice.id ? updated : inv)));
    setSelectedInvoice(updated);
    showToast("Invoice marked as paid!");
  };

  const handleSendInvoice = async (invoice: Invoice) => {
    const updated = { ...invoice, status: "sent" as const };
    await storage.set(`invoice:${invoice.id}`, JSON.stringify(updated));
    setInvoices(invoices.map((inv) => (inv.id === invoice.id ? updated : inv)));
    setSelectedInvoice(updated);
    showToast(`Invoice sent to ${invoice.customerEmail}!`);
  };

  const resetForm = () => {
    setFormData({
      customerId: "",
      issueDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      notes: "",
      paymentMethod: "Bank Transfer",
      lineItems: [
        { id: "1", description: "", quantity: 1, unitPrice: 0, tax: 10 },
      ],
    });
    setSelectedInvoice(null);
  };

  const showToast = (message: string) => {
    // Simple toast implementation - you can use a library like react-hot-toast
    alert(message);
  };

  const addLineItem = () => {
    setFormData({
      ...formData,
      lineItems: [
        ...formData.lineItems,
        {
          id: String(Date.now()),
          description: "",
          quantity: 1,
          unitPrice: 0,
          tax: 10,
        },
      ],
    });
  };

  const removeLineItem = (id: string) => {
    setFormData({
      ...formData,
      lineItems: formData.lineItems.filter((item) => item.id !== id),
    });
  };

  const updateLineItem = (id: string, field: string, value: any) => {
    setFormData({
      ...formData,
      lineItems: formData.lineItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    });
  };

  // Calculate stats
  const totalRevenue = invoices.reduce(
    (sum, inv) => sum + (inv.status === "paid" ? inv.total : 0),
    0
  );
  const pendingAmount = invoices.reduce(
    (sum, inv) =>
      sum + (inv.status === "sent" || inv.status === "overdue" ? inv.total : 0),
    0
  );
  const overdueCount = invoices.filter(
    (inv) => inv.status === "overdue"
  ).length;

  // Render List View
  if (view === "list") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Invoices
              </h1>
              <p className="text-gray-600 mt-1">
                Manage and track your invoices
              </p>
            </div>
            <Button
              onClick={() => setView("create")}
              className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Invoice
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">
                      Total Revenue
                    </p>
                    <p className="text-3xl font-bold mt-2">
                      ${totalRevenue.toFixed(2)}
                    </p>
                  </div>
                  <DollarSign className="h-12 w-12 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Pending</p>
                    <p className="text-3xl font-bold mt-2">
                      ${pendingAmount.toFixed(2)}
                    </p>
                  </div>
                  <Clock className="h-12 w-12 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">
                      Total Invoices
                    </p>
                    <p className="text-3xl font-bold mt-2">{invoices.length}</p>
                  </div>
                  <FileText className="h-12 w-12 text-purple-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-red-500 to-red-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm font-medium">Overdue</p>
                    <p className="text-3xl font-bold mt-2">{overdueCount}</p>
                  </div>
                  <AlertCircle className="h-12 w-12 text-red-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="relative sm:col-span-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by invoice number, customer..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Invoice Table - Desktop */}
          <Card className="border-0 shadow-lg hidden md:block">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        Invoice #
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        Customer
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        Issue Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        Due Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredInvoices.map((invoice) => (
                      <tr
                        key={invoice.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900">
                            {invoice.invoiceNumber}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900">
                            {invoice.customerName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {invoice.customerEmail}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900">
                            {invoice.issueDate}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900">
                            {invoice.dueDate}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-900">
                            ${invoice.total.toFixed(2)}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              invoice.status
                            )}`}
                          >
                            {getStatusIcon(invoice.status)}
                            {invoice.status.charAt(0).toUpperCase() +
                              invoice.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setSelectedInvoice(invoice);
                                setView("detail");
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {(invoice.status === "draft" ||
                              invoice.status === "sent") && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setSelectedInvoice(invoice);
                                  setFormData({
                                    customerId: invoice.customerId,
                                    issueDate: invoice.issueDate,
                                    dueDate: invoice.dueDate,
                                    notes: invoice.notes,
                                    paymentMethod: invoice.paymentMethod,
                                    lineItems: invoice.lineItems,
                                  });
                                  setView("edit");
                                }}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setInvoiceToDelete(invoice.id);
                                setShowDeleteModal(true);
                              }}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Invoice Cards - Mobile */}
          <div className="md:hidden space-y-4">
            {filteredInvoices.map((invoice) => (
              <Card key={invoice.id} className="border-0 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {invoice.invoiceNumber}
                      </p>
                      <p className="text-sm text-gray-600">
                        {invoice.customerName}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        invoice.status
                      )}`}
                    >
                      {getStatusIcon(invoice.status)}
                      {invoice.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                    <div>
                      <p className="text-gray-500">Issue Date</p>
                      <p className="font-medium">{invoice.issueDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Due Date</p>
                      <p className="font-medium">{invoice.dueDate}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-500">Total Amount</p>
                      <p className="text-lg font-bold text-gray-900">
                        ${invoice.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedInvoice(invoice);
                        setView("detail");
                      }}
                      className="flex-1"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    {(invoice.status === "draft" ||
                      invoice.status === "sent") && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedInvoice(invoice);
                          setFormData({
                            customerId: invoice.customerId,
                            issueDate: invoice.issueDate,
                            dueDate: invoice.dueDate,
                            notes: invoice.notes,
                            paymentMethod: invoice.paymentMethod,
                            lineItems: invoice.lineItems,
                          });
                          setView("edit");
                        }}
                        className="flex-1"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setInvoiceToDelete(invoice.id);
                        setShowDeleteModal(true);
                      }}
                      className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredInvoices.length === 0 && (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No invoices found
                </h3>
                <p className="text-gray-500 mb-4">
                  {invoices.length === 0
                    ? "Get started by creating your first invoice"
                    : "Try adjusting your search or filter criteria"}
                </p>
                {invoices.length === 0 && (
                  <Button
                    onClick={() => setView("create")}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Invoice
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // Render Create/Edit View
  if (view === "create" || view === "edit") {
    const isEditing = view === "edit";
    const calculatedItems = formData.lineItems.map(calculateLineItem);
    const { subtotal, tax, total } = calculateTotals(calculatedItems);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isEditing ? "Edit Invoice" : "Create Invoice"}
              </h1>
              <p className="text-gray-600 mt-1">
                {isEditing
                  ? "Update invoice details"
                  : "Create a new invoice for your customer"}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                resetForm();
                setView("list");
              }}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 space-y-6">
              {/* Customer Selection */}
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-700">
                  Customer *
                </label>
                <Select
                  value={formData.customerId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, customerId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name} - {customer.company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-700">
                    Issue Date *
                  </label>
                  <Input
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, issueDate: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-700">
                    Due Date *
                  </label>
                  <Input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, dueDate: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-700">
                  Payment Method
                </label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value) =>
                    setFormData({ ...formData, paymentMethod: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                    <SelectItem value="PayPal">PayPal</SelectItem>
                    <SelectItem value="Cash">Cash</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Line Items */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-medium text-gray-700">
                    Line Items
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addLineItem}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Item
                  </Button>
                </div>

                <div className="space-y-4">
                  {formData.lineItems.map((item, index) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-12 gap-3 items-start p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="col-span-12 md:col-span-5">
                        <Input
                          placeholder="Item description"
                          value={item.description}
                          onChange={(e) =>
                            updateLineItem(
                              item.id,
                              "description",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="col-span-4 md:col-span-2">
                        <Input
                          type="number"
                          min="1"
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) =>
                            updateLineItem(
                              item.id,
                              "quantity",
                              parseInt(e.target.value) || 0
                            )
                          }
                        />
                      </div>
                      <div className="col-span-4 md:col-span-2">
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="Price"
                          value={item.unitPrice}
                          onChange={(e) =>
                            updateLineItem(
                              item.id,
                              "unitPrice",
                              parseFloat(e.target.value) || 0
                            )
                          }
                        />
                      </div>
                      <div className="col-span-3 md:col-span-2">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="Tax %"
                          value={item.tax}
                          onChange={(e) =>
                            updateLineItem(
                              item.id,
                              "tax",
                              parseFloat(e.target.value) || 0
                            )
                          }
                        />
                      </div>
                      <div className="col-span-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLineItem(item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 h-10 w-10 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span className="text-gray-900">Total:</span>
                  <span className="text-blue-600">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-700">
                  Notes
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Additional notes or terms..."
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={
                    isEditing ? handleUpdateInvoice : handleCreateInvoice
                  }
                  className="bg-blue-600 hover:bg-blue-700 flex-1"
                  disabled={
                    !formData.customerId ||
                    formData.lineItems.some(
                      (item) => !item.description || item.unitPrice <= 0
                    )
                  }
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isEditing ? "Update Invoice" : "Create Invoice"}
                </Button>
                {isEditing && (
                  <Button
                    onClick={() =>
                      selectedInvoice && handleSendInvoice(selectedInvoice)
                    }
                    variant="outline"
                    className="flex-1"
                    disabled={selectedInvoice?.status === "paid"}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Invoice
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Render Detail View
  if (view === "detail" && selectedInvoice) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Invoice Details
              </h1>
              <p className="text-gray-600 mt-1">
                {selectedInvoice.invoiceNumber}
              </p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={() => setView("list")}
                className="flex-1 sm:flex-none"
              >
                <X className="h-4 w-4 mr-2" />
                Back
              </Button>
              {selectedInvoice.status !== "paid" && (
                <Button
                  onClick={() => handleMarkAsPaid(selectedInvoice)}
                  className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Paid
                </Button>
              )}
              {selectedInvoice.status === "draft" && (
                <Button
                  onClick={() => handleSendInvoice(selectedInvoice)}
                  className="bg-blue-600 hover:bg-blue-700 flex-1 sm:flex-none"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Invoice
                </Button>
              )}
            </div>
          </div>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              {/* Invoice Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedInvoice.invoiceNumber}
                  </h2>
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border mt-2 ${getStatusColor(
                      selectedInvoice.status
                    )}`}
                  >
                    {getStatusIcon(selectedInvoice.status)}
                    {selectedInvoice.status.charAt(0).toUpperCase() +
                      selectedInvoice.status.slice(1)}
                  </span>
                </div>
                <div className="text-right mt-4 md:mt-0">
                  <p className="text-3xl font-bold text-blue-600">
                    ${selectedInvoice.total.toFixed(2)}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Due:{" "}
                    {new Date(selectedInvoice.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Customer and Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Bill To</h3>
                  <p className="font-medium text-gray-900">
                    {selectedInvoice.customerName}
                  </p>
                  <p className="text-gray-600">
                    {selectedInvoice.customerEmail}
                  </p>
                </div>
                <div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Issue Date</p>
                      <p className="font-medium">{selectedInvoice.issueDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Due Date</p>
                      <p className="font-medium">{selectedInvoice.dueDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Payment Method</p>
                      <p className="font-medium">
                        {selectedInvoice.paymentMethod}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Paid Amount</p>
                      <p className="font-medium">
                        ${selectedInvoice.paidAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Line Items */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">Items</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                          Description
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                          Qty
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                          Price
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                          Tax
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {selectedInvoice.lineItems.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3 text-sm">
                            {item.description}
                          </td>
                          <td className="px-4 py-3 text-sm">{item.quantity}</td>
                          <td className="px-4 py-3 text-sm">
                            ${item.unitPrice.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-sm">{item.tax}%</td>
                          <td className="px-4 py-3 text-sm font-medium">
                            ${item.subtotal.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">
                      ${selectedInvoice.subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax:</span>
                    <span className="font-medium">
                      ${selectedInvoice.tax.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span className="text-gray-900">Total:</span>
                    <span className="text-blue-600">
                      ${selectedInvoice.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedInvoice.notes && (
                <div className="mt-8 pt-6 border-t">
                  <h3 className="font-semibold text-gray-900 mb-3">Notes</h3>
                  <p className="text-gray-600 text-sm">
                    {selectedInvoice.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Delete Confirmation Modal
  if (showDeleteModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="border-0 shadow-xl max-w-md w-full">
          <CardContent className="p-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Delete Invoice
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this invoice? This action cannot
                be undone.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setInvoiceToDelete(null);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() =>
                    invoiceToDelete && handleDeleteInvoice(invoiceToDelete)
                  }
                  className="bg-red-600 hover:bg-red-700 flex-1"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default InvoiceCRM;

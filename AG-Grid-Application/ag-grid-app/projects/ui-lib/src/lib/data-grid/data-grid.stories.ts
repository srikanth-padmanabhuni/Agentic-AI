import type { Meta, StoryObj } from '@storybook/angular';
import { UiDataGridComponent } from './data-grid.component';
import type { ColDef, GetDataPath, IDetailCellRendererParams } from 'ag-grid-community';

// ─── Basic sample data ──────────────────────────────────────

const sampleData = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', status: 'Active' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', status: 'Inactive' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', status: 'Active' },
  { id: 4, name: 'Dave Brown', email: 'dave@example.com', status: 'Pending' },
  { id: 5, name: 'Eve Davis', email: 'eve@example.com', status: 'Active' },
];

const sampleColumns: ColDef[] = [
  { field: 'id', headerName: 'ID', width: 80 },
  { field: 'name', headerName: 'Name', flex: 1 },
  { field: 'email', headerName: 'Email', flex: 1 },
  { field: 'status', headerName: 'Status', width: 120 },
];

// ─── Master-Detail sample data ──────────────────────────────

interface OrderDetail {
  orderId: string;
  product: string;
  quantity: number;
  unitPrice: number;
}

interface MasterRow {
  name: string;
  department: string;
  role: string;
  totalOrders: number;
  orders: OrderDetail[];
}

const masterDetailData: MasterRow[] = [
  {
    name: 'Alice Johnson',
    department: 'Engineering',
    role: 'Lead Developer',
    totalOrders: 3,
    orders: [
      { orderId: 'ORD-001', product: 'Laptop', quantity: 2, unitPrice: 1200 },
      { orderId: 'ORD-002', product: 'Monitor', quantity: 3, unitPrice: 450 },
      { orderId: 'ORD-003', product: 'Keyboard', quantity: 5, unitPrice: 75 },
    ],
  },
  {
    name: 'Bob Smith',
    department: 'Marketing',
    role: 'Marketing Manager',
    totalOrders: 2,
    orders: [
      { orderId: 'ORD-004', product: 'Brochures', quantity: 500, unitPrice: 2 },
      { orderId: 'ORD-005', product: 'Banner Ads', quantity: 10, unitPrice: 300 },
    ],
  },
  {
    name: 'Carol White',
    department: 'Sales',
    role: 'Sales Director',
    totalOrders: 4,
    orders: [
      { orderId: 'ORD-006', product: 'CRM License', quantity: 10, unitPrice: 150 },
      { orderId: 'ORD-007', product: 'Phone System', quantity: 5, unitPrice: 200 },
      { orderId: 'ORD-008', product: 'Headsets', quantity: 15, unitPrice: 80 },
      { orderId: 'ORD-009', product: 'Desk Phone', quantity: 5, unitPrice: 120 },
    ],
  },
  {
    name: 'Dave Brown',
    department: 'HR',
    role: 'HR Specialist',
    totalOrders: 1,
    orders: [
      { orderId: 'ORD-010', product: 'Training Material', quantity: 50, unitPrice: 25 },
    ],
  },
  {
    name: 'Eve Davis',
    department: 'Engineering',
    role: 'QA Engineer',
    totalOrders: 2,
    orders: [
      { orderId: 'ORD-011', product: 'Testing Tools License', quantity: 3, unitPrice: 500 },
      { orderId: 'ORD-012', product: 'Bug Tracker License', quantity: 1, unitPrice: 800 },
    ],
  },
];

const masterColumns: ColDef[] = [
  { field: 'name', headerName: 'Name', flex: 1, cellRenderer: 'agGroupCellRenderer' },
  { field: 'department', headerName: 'Department', flex: 1 },
  { field: 'role', headerName: 'Role', flex: 1 },
  { field: 'totalOrders', headerName: 'Total Orders', width: 140 },
];

const detailColumnDefs: ColDef[] = [
  { field: 'orderId', headerName: 'Order ID', width: 120 },
  { field: 'product', headerName: 'Product', flex: 1 },
  { field: 'quantity', headerName: 'Quantity', width: 110 },
  { field: 'unitPrice', headerName: 'Unit Price', width: 120, valueFormatter: (p) => p.value != null ? `$${p.value.toFixed(2)}` : '' },
];

const detailCellRendererParams: Partial<IDetailCellRendererParams> = {
  detailGridOptions: {
    columnDefs: detailColumnDefs,
    defaultColDef: { sortable: true, resizable: true, filter: true },
  },
  getDetailRowData: (params) => {
    params.successCallback((params.data as MasterRow).orders);
  },
};

// ─── Tree Data sample data ──────────────────────────────────

interface OrgRow {
  orgHierarchy: string[];
  name: string;
  role: string;
  email: string;
  employeeCount?: number;
}

const treeDataRows: OrgRow[] = [
  { orgHierarchy: ['Acme Corp'], name: 'Acme Corp', role: 'Organization', email: 'info@acme.com', employeeCount: 120 },
  { orgHierarchy: ['Acme Corp', 'Engineering'], name: 'Engineering', role: 'Department', email: 'eng@acme.com', employeeCount: 45 },
  { orgHierarchy: ['Acme Corp', 'Engineering', 'Frontend'], name: 'Frontend', role: 'Team', email: 'frontend@acme.com', employeeCount: 15 },
  { orgHierarchy: ['Acme Corp', 'Engineering', 'Frontend', 'Alice Johnson'], name: 'Alice Johnson', role: 'Lead Developer', email: 'alice@acme.com' },
  { orgHierarchy: ['Acme Corp', 'Engineering', 'Frontend', 'Bob Smith'], name: 'Bob Smith', role: 'Senior Developer', email: 'bob@acme.com' },
  { orgHierarchy: ['Acme Corp', 'Engineering', 'Backend'], name: 'Backend', role: 'Team', email: 'backend@acme.com', employeeCount: 18 },
  { orgHierarchy: ['Acme Corp', 'Engineering', 'Backend', 'Carol White'], name: 'Carol White', role: 'Backend Lead', email: 'carol@acme.com' },
  { orgHierarchy: ['Acme Corp', 'Engineering', 'Backend', 'Dave Brown'], name: 'Dave Brown', role: 'Developer', email: 'dave@acme.com' },
  { orgHierarchy: ['Acme Corp', 'Engineering', 'DevOps'], name: 'DevOps', role: 'Team', email: 'devops@acme.com', employeeCount: 12 },
  { orgHierarchy: ['Acme Corp', 'Engineering', 'DevOps', 'Eve Davis'], name: 'Eve Davis', role: 'DevOps Engineer', email: 'eve@acme.com' },
  { orgHierarchy: ['Acme Corp', 'Sales'], name: 'Sales', role: 'Department', email: 'sales@acme.com', employeeCount: 30 },
  { orgHierarchy: ['Acme Corp', 'Sales', 'Enterprise'], name: 'Enterprise', role: 'Team', email: 'enterprise@acme.com', employeeCount: 15 },
  { orgHierarchy: ['Acme Corp', 'Sales', 'Enterprise', 'Frank Miller'], name: 'Frank Miller', role: 'Account Executive', email: 'frank@acme.com' },
  { orgHierarchy: ['Acme Corp', 'Sales', 'SMB'], name: 'SMB', role: 'Team', email: 'smb@acme.com', employeeCount: 15 },
  { orgHierarchy: ['Acme Corp', 'Sales', 'SMB', 'Grace Lee'], name: 'Grace Lee', role: 'Sales Rep', email: 'grace@acme.com' },
  { orgHierarchy: ['Acme Corp', 'HR'], name: 'HR', role: 'Department', email: 'hr@acme.com', employeeCount: 10 },
  { orgHierarchy: ['Acme Corp', 'HR', 'Henry Wilson'], name: 'Henry Wilson', role: 'HR Manager', email: 'henry@acme.com' },
];

const treeDataGetDataPath: GetDataPath = (data: OrgRow) => data.orgHierarchy;

const treeAutoGroupColumnDef: ColDef = {
  headerName: 'Organization',
  minWidth: 300,
  cellRendererParams: { suppressCount: false },
};

const treeColumns: ColDef[] = [
  { field: 'role', headerName: 'Role', flex: 1 },
  { field: 'email', headerName: 'Email', flex: 1 },
  { field: 'employeeCount', headerName: 'Employees', width: 130 },
];

// ─── Meta ───────────────────────────────────────────────────

const meta: Meta<UiDataGridComponent> = {
  title: 'Components/DataGrid',
  component: UiDataGridComponent,
  tags: ['autodocs'],
  argTypes: {
    // Common
    pagination: { control: 'boolean' },
    paginationPageSize: { control: 'number' },
    domLayout: { control: 'select', options: ['normal', 'autoHeight'] },
    gridHeight: { control: 'text' },
    quickFilterText: { control: 'text' },

    // Master-Detail
    masterDetail: { control: 'boolean' },
    detailRowHeight: { control: 'number' },
    detailRowAutoHeight: { control: 'boolean' },
    keepDetailRows: { control: 'boolean' },
    keepDetailRowsCount: { control: 'number' },
    embedFullWidthRows: { control: 'boolean' },

    // Tree Data
    treeData: { control: 'boolean' },
    groupDefaultExpanded: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<UiDataGridComponent>;

// ─── Basic Stories ──────────────────────────────────────────

export const Default: Story = {
  args: {
    rowData: sampleData,
    columnDefs: sampleColumns,
    pagination: true,
    paginationPageSize: 25,
    gridHeight: '300px',
  },
};

export const AutoHeight: Story = {
  args: {
    rowData: sampleData,
    columnDefs: sampleColumns,
    domLayout: 'autoHeight',
    pagination: false,
  },
};

export const WithQuickFilter: Story = {
  args: {
    rowData: sampleData,
    columnDefs: sampleColumns,
    quickFilterText: 'Active',
    gridHeight: '300px',
  },
};

export const Empty: Story = {
  args: {
    rowData: [],
    columnDefs: sampleColumns,
    gridHeight: '200px',
  },
};

// ─── Master-Detail Stories ──────────────────────────────────

export const MasterDetail: Story = {
  args: {
    rowData: masterDetailData,
    columnDefs: masterColumns,
    masterDetail: true,
    detailCellRendererParams: detailCellRendererParams,
    detailRowHeight: 200,
    detailRowAutoHeight: false,
    keepDetailRows: false,
    embedFullWidthRows: false,
    pagination: false,
    gridHeight: '500px',
  },
};

export const MasterDetailAutoHeight: Story = {
  args: {
    rowData: masterDetailData,
    columnDefs: masterColumns,
    masterDetail: true,
    detailCellRendererParams: detailCellRendererParams,
    detailRowAutoHeight: true,
    keepDetailRows: true,
    keepDetailRowsCount: 10,
    pagination: false,
    gridHeight: '600px',
  },
};

export const MasterDetailConditional: Story = {
  render: (args) => ({
    props: {
      ...args,
      isRowMaster: (data: MasterRow) => data.totalOrders > 1,
    },
    template: `<ui-data-grid
      [rowData]="rowData"
      [columnDefs]="columnDefs"
      [masterDetail]="masterDetail"
      [detailCellRendererParams]="detailCellRendererParams"
      [isRowMaster]="isRowMaster"
      [detailRowHeight]="detailRowHeight"
      [pagination]="pagination"
      [gridHeight]="gridHeight" />`,
  }),
  args: {
    rowData: masterDetailData,
    columnDefs: masterColumns,
    masterDetail: true,
    detailCellRendererParams: detailCellRendererParams,
    detailRowHeight: 200,
    pagination: false,
    gridHeight: '500px',
  },
};

// ─── Tree Data Stories ──────────────────────────────────────

const treeDataRender = (args: Record<string, unknown>) => ({
  props: {
    ...args,
    getDataPath: treeDataGetDataPath,
  },
  template: `<ui-data-grid
    [rowData]="rowData"
    [columnDefs]="columnDefs"
    [treeData]="treeData"
    [getDataPath]="getDataPath"
    [autoGroupColumnDef]="autoGroupColumnDef"
    [groupDefaultExpanded]="groupDefaultExpanded"
    [pagination]="pagination"
    [gridHeight]="gridHeight" />`,
});

export const TreeData: Story = {
  render: (args) => treeDataRender(args),
  args: {
    rowData: treeDataRows,
    columnDefs: treeColumns,
    treeData: true,
    autoGroupColumnDef: treeAutoGroupColumnDef,
    groupDefaultExpanded: -1,
    pagination: false,
    gridHeight: '600px',
  },
};

export const TreeDataCollapsed: Story = {
  render: (args) => treeDataRender(args),
  args: {
    rowData: treeDataRows,
    columnDefs: treeColumns,
    treeData: true,
    autoGroupColumnDef: treeAutoGroupColumnDef,
    groupDefaultExpanded: 0,
    pagination: false,
    gridHeight: '500px',
  },
};

export const TreeDataExpandedOneLevel: Story = {
  render: (args) => treeDataRender(args),
  args: {
    rowData: treeDataRows,
    columnDefs: treeColumns,
    treeData: true,
    autoGroupColumnDef: treeAutoGroupColumnDef,
    groupDefaultExpanded: 1,
    pagination: false,
    gridHeight: '500px',
  },
};

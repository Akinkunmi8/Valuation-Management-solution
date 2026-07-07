import type { Facility } from '../types/facilityTypes'

export const facilityMockData: Facility[] = [
  {
    id: '1',
    referenceNo: 'FAC-2026-0001',

    customerName: 'Dangote Group Plc',
    cifNumber: 'CIF000001',
    accountNumber: '0123456789',
    customerType: 'CORPORATE',

    facilityType: 'TERM_LOAN',
    facilityAmount: 500000000,
    currency: 'NGN',
    purpose: 'Factory Expansion',

    collateralType: 'PROPERTY',

    branchName: 'Victoria Island Branch',
    solId: '1002',

    rmName: 'Aderemi Abiodun',
    rmStaffId: 'RM001',

    status: 'AWAITING_PAYMENT',
    paymentStatus: 'UNPAID',

    createdAt: '2026-06-20T08:30:00Z',
    updatedAt: '2026-06-20T08:30:00Z',
  },

  {
    id: '2',
    referenceNo: 'FAC-2026-0002',

    customerName: 'MTN Nigeria',
    cifNumber: 'CIF000002',
    accountNumber: '0234567890',
    customerType: 'CORPORATE',

    facilityType: 'OVERDRAFT',
    facilityAmount: 250000000,
    currency: 'NGN',
    purpose: 'Working Capital',

    collateralType: 'EQUIPMENT',

    branchName: 'Lagos Island Branch',
    solId: '1001',

    rmName: 'Aderemi Abiodun',
    rmStaffId: 'RM001',

    status: 'CMU_REVIEW',
    paymentStatus: 'PAID',

    createdAt: '2026-06-18T10:15:00Z',
    updatedAt: '2026-06-19T14:45:00Z',
  },

  {
    id: '3',
    referenceNo: 'FAC-2026-0003',

    customerName: 'ABC Manufacturing Ltd',
    cifNumber: 'CIF000003',
    accountNumber: '0345678901',
    customerType: 'CORPORATE',

    facilityType: 'WORKING_CAPITAL',
    facilityAmount: 100000000,
    currency: 'NGN',
    purpose: 'Inventory Financing',

    collateralType: 'INVENTORY',

    branchName: 'Ikorodu Branch',
    solId: '1003',

    rmName: 'Aderemi Abiodun',
    rmStaffId: 'RM001',

    status: 'COMPLETED',
    paymentStatus: 'PAID',

    createdAt: '2026-06-15T09:00:00Z',
    updatedAt: '2026-06-17T17:30:00Z',
  },
]
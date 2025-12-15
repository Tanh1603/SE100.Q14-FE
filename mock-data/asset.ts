import { AssetStatus, AssetTypeFieldEnum } from "@/types/enum";
import { Asset, AssetType, loan } from "./../types/asset";
import { mockCustomer } from "./customer";
import { mockwarehouses } from "./warehouse";
export const mockAssetType: AssetType[] = [
  {
    id: "1",
    name: "Xe máy",
    isActive: true,
    field: [
      {
        id: "a",
        label: "Biển kiếm soát",
        required: true,
        type: AssetTypeFieldEnum.STRING,
      },
      {
        id: "b",
        label: "Số khung",
        required: true,
        type: AssetTypeFieldEnum.STRING,
      },
      {
        id: "c",
        label: "Số máy",
        required: true,
        type: AssetTypeFieldEnum.STRING,
      },
    ],
  },

  {
    id: "2",
    name: "Điện thoại",
    isActive: true,
    field: [
      {
        id: "d",
        label: "IMEI",
        required: true,
        type: AssetTypeFieldEnum.STRING,
      },
      {
        id: "e",
        label: "Password",
        required: true,
        type: AssetTypeFieldEnum.STRING,
      },
      {
        id: "f",
        label: "Số máy",
        required: true,
        type: AssetTypeFieldEnum.STRING,
      },
    ],
  },
];

export const mockLoans: loan[] = [
  {
    id: "l1",
    loanDate: "2025-12-15",
    totalLoan: 5000000,
    interestPeriod: 6,
    interestRate: 1.5,
    numberPayment: 6,
    customer: mockCustomer[0],
    asset: {
      id: "a1",
      name: "Wave RSX",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx49yGlanyAwLALpzN7RXxKhoO7PEdr2UXfQ&s",
      assetType: mockAssetType[0],
      warehouses: mockwarehouses[0],
      status: AssetStatus.PLEDGED,
      assetValue: [
        { id: "v1", assetId: "a1", assetTypeField: "a", value: "30B1-12345" },
        { id: "v2", assetId: "a1", assetTypeField: "b", value: "KH123456789" },
      ],
    },
  },
  {
    id: "l2",
    loanDate: "2025-12-12",
    totalLoan: 10000000,
    interestPeriod: 12,
    interestRate: 2,
    numberPayment: 12,
    customer: mockCustomer[1],
    asset: {
      id: "a2",
      name: "iPhone 14",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx49yGlanyAwLALpzN7RXxKhoO7PEdr2UXfQ&s",
      assetType: mockAssetType[1],
      warehouses: mockwarehouses[1],
      status: AssetStatus.STORED,
      assetValue: [
        {
          id: "v3",
          assetId: "a2",
          assetTypeField: "d",
          value: "356789012345678",
        },
      ],
    },
  },
];

export const mockAssets: Asset[] = [
  {
    id: "a1",
    name: "Wave RSX",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx49yGlanyAwLALpzN7RXxKhoO7PEdr2UXfQ&s",
    assetType: mockAssetType[0],
    warehouses: mockwarehouses[0],
    status: AssetStatus.PLEDGED,
    assetValue: [
      { id: "v1", assetId: "a1", assetTypeField: "a", value: "30B1-12345" },
      { id: "v2", assetId: "a1", assetTypeField: "b", value: "KH123456789" },
      { id: "v3", assetId: "a1", assetTypeField: "c", value: "SM123456" },
    ],
  },
  {
    id: "a2",
    name: "iPhone 14",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx49yGlanyAwLALpzN7RXxKhoO7PEdr2UXfQ&s",
    assetType: mockAssetType[1],
    warehouses: mockwarehouses[1],
    status: AssetStatus.STORED,
    assetValue: [
      {
        id: "v4",
        assetId: "a2",
        assetTypeField: "d",
        value: "356789012345678",
      },
      { id: "v5", assetId: "a2", assetTypeField: "e", value: "123456" },
      { id: "v6", assetId: "a2", assetTypeField: "f", value: "SM987654" },
    ],
  },
  {
    id: "a2",
    name: "iPhone 14",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx49yGlanyAwLALpzN7RXxKhoO7PEdr2UXfQ&s",
    assetType: mockAssetType[1],
    warehouses: mockwarehouses[1],
    status: AssetStatus.STORED,
    assetValue: [
      {
        id: "v4",
        assetId: "a2",
        assetTypeField: "d",
        value: "356789012345678",
      },
      { id: "v5", assetId: "a2", assetTypeField: "e", value: "123456" },
      { id: "v6", assetId: "a2", assetTypeField: "f", value: "SM987654" },
    ],
  },
  {
    id: "a2",
    name: "iPhone 14",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx49yGlanyAwLALpzN7RXxKhoO7PEdr2UXfQ&s",
    assetType: mockAssetType[1],
    warehouses: mockwarehouses[1],
    status: AssetStatus.STORED,
    assetValue: [
      {
        id: "v4",
        assetId: "a2",
        assetTypeField: "d",
        value: "356789012345678",
      },
      { id: "v5", assetId: "a2", assetTypeField: "e", value: "123456" },
      { id: "v6", assetId: "a2", assetTypeField: "f", value: "SM987654" },
    ],
  },
  {
    id: "a2",
    name: "iPhone 14",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx49yGlanyAwLALpzN7RXxKhoO7PEdr2UXfQ&s",
    assetType: mockAssetType[1],
    warehouses: mockwarehouses[1],
    status: AssetStatus.STORED,
    assetValue: [
      {
        id: "v4",
        assetId: "a2",
        assetTypeField: "d",
        value: "356789012345678",
      },
      { id: "v5", assetId: "a2", assetTypeField: "e", value: "123456" },
      { id: "v6", assetId: "a2", assetTypeField: "f", value: "SM987654" },
    ],
  },
  {
    id: "a2",
    name: "iPhone 14",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx49yGlanyAwLALpzN7RXxKhoO7PEdr2UXfQ&s",
    assetType: mockAssetType[1],
    warehouses: mockwarehouses[1],
    status: AssetStatus.STORED,
    assetValue: [
      {
        id: "v4",
        assetId: "a2",
        assetTypeField: "d",
        value: "356789012345678",
      },
      { id: "v5", assetId: "a2", assetTypeField: "e", value: "123456" },
      { id: "v6", assetId: "a2", assetTypeField: "f", value: "SM987654" },
    ],
  },
  {
    id: "a2",
    name: "iPhone 14",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx49yGlanyAwLALpzN7RXxKhoO7PEdr2UXfQ&s",
    assetType: mockAssetType[1],
    warehouses: mockwarehouses[1],
    status: AssetStatus.STORED,
    assetValue: [
      {
        id: "v4",
        assetId: "a2",
        assetTypeField: "d",
        value: "356789012345678",
      },
      { id: "v5", assetId: "a2", assetTypeField: "e", value: "123456" },
      { id: "v6", assetId: "a2", assetTypeField: "f", value: "SM987654" },
    ],
  },
  {
    id: "a2",
    name: "iPhone 14",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx49yGlanyAwLALpzN7RXxKhoO7PEdr2UXfQ&s",
    assetType: mockAssetType[1],
    warehouses: mockwarehouses[1],
    status: AssetStatus.STORED,
    assetValue: [
      {
        id: "v4",
        assetId: "a2",
        assetTypeField: "d",
        value: "356789012345678",
      },
      { id: "v5", assetId: "a2", assetTypeField: "e", value: "123456" },
      { id: "v6", assetId: "a2", assetTypeField: "f", value: "SM987654" },
    ],
  },

  {
    id: "a2",
    name: "iPhone 14",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx49yGlanyAwLALpzN7RXxKhoO7PEdr2UXfQ&s",
    assetType: mockAssetType[1],
    warehouses: mockwarehouses[1],
    status: AssetStatus.STORED,
    assetValue: [
      {
        id: "v4",
        assetId: "a2",
        assetTypeField: "d",
        value: "356789012345678",
      },
      { id: "v5", assetId: "a2", assetTypeField: "e", value: "123456" },
      { id: "v6", assetId: "a2", assetTypeField: "f", value: "SM987654" },
    ],
  },
  {
    id: "a2",
    name: "iPhone 14",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx49yGlanyAwLALpzN7RXxKhoO7PEdr2UXfQ&s",
    assetType: mockAssetType[1],
    warehouses: mockwarehouses[1],
    status: AssetStatus.STORED,
    assetValue: [
      {
        id: "v4",
        assetId: "a2",
        assetTypeField: "d",
        value: "356789012345678",
      },
      { id: "v5", assetId: "a2", assetTypeField: "e", value: "123456" },
      { id: "v6", assetId: "a2", assetTypeField: "f", value: "SM987654" },
    ],
  },
];

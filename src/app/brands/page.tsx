"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ArrowRight } from "lucide-react";
import { ProductItem } from "@/lib/types";
import CatalogPdfGateModal from "@/components/CatalogPdfGateModal";

export type CatalogThumb = {
  id?: string;
  title: string;
  pdfUrl?: string;
  pdfDownloadUrl?: string;
  coverImage?: string;
  fileId?: string;
  themeStyle?: React.CSSProperties;
  themeClass?: string;
};

export type BrandItemData = {
  id: string;
  name: string;
  category: string;
  origin: string;
  estYear: string;
  catalogCount: string;
  filterTag: string;
  catalogs: CatalogThumb[];
};

const FILTER_PILLS = ["All", "Surfaces", "Flooring", "Bathroom", "Cladding", "Doors", "Furniture"];

const DEFAULT_BRANDS: BrandItemData[] = [
  {
    "id": "mirage",
    "name": "MIRAGE",
    "category": "Tiles & Surfaces \u00b7 Italy",
    "origin": "Italy",
    "estYear": "EST. 1976",
    "catalogCount": "9 catalogs",
    "filterTag": "Surfaces",
    "catalogs": [
      {
        "id": "mirage-cat-1",
        "title": "CATALOG 01",
        "pdfUrl": "https://drive.google.com/file/d/1P2XBvLeeL6eFmvwT-sBvaX1qQuqm_43b/view?usp=drive_link",
        "pdfDownloadUrl": "https://drive.google.com/uc?export=download&id=1P2XBvLeeL6eFmvwT-sBvaX1qQuqm_43b",
        "coverImage": "https://lh3.googleusercontent.com/d/1P2XBvLeeL6eFmvwT-sBvaX1qQuqm_43b=s800",
        "fileId": "1P2XBvLeeL6eFmvwT-sBvaX1qQuqm_43b"
      },
      {
        "id": "mirage-cat-2",
        "title": "CATALOG 02",
        "pdfUrl": "https://drive.google.com/file/d/1V5bEiUABaE5BF4JagbAF0uC-iiJvwtXE/view?usp=drive_link",
        "pdfDownloadUrl": "https://drive.google.com/uc?export=download&id=1V5bEiUABaE5BF4JagbAF0uC-iiJvwtXE",
        "coverImage": "https://lh3.googleusercontent.com/d/1V5bEiUABaE5BF4JagbAF0uC-iiJvwtXE=s800",
        "fileId": "1V5bEiUABaE5BF4JagbAF0uC-iiJvwtXE"
      },
      {
        "id": "mirage-cat-3",
        "title": "CATALOG 03",
        "pdfUrl": "https://drive.google.com/file/d/1x6q3rb1Z9k-HWxDXjA4c5h_sC3TKQNP4/view?usp=drive_link",
        "pdfDownloadUrl": "https://drive.google.com/uc?export=download&id=1x6q3rb1Z9k-HWxDXjA4c5h_sC3TKQNP4",
        "coverImage": "https://lh3.googleusercontent.com/d/1x6q3rb1Z9k-HWxDXjA4c5h_sC3TKQNP4=s800",
        "fileId": "1x6q3rb1Z9k-HWxDXjA4c5h_sC3TKQNP4"
      },
      {
        "id": "mirage-cat-4",
        "title": "CATALOG 04",
        "pdfUrl": "https://drive.google.com/file/d/1oUtwekVav7no9FKYOe7E_X3bgMZa56y_/view?usp=drive_link",
        "pdfDownloadUrl": "https://drive.google.com/uc?export=download&id=1oUtwekVav7no9FKYOe7E_X3bgMZa56y_",
        "coverImage": "https://lh3.googleusercontent.com/d/1oUtwekVav7no9FKYOe7E_X3bgMZa56y_=s800",
        "fileId": "1oUtwekVav7no9FKYOe7E_X3bgMZa56y_"
      },
      {
        "id": "mirage-cat-5",
        "title": "CATALOG 05",
        "pdfUrl": "https://drive.google.com/file/d/1zHDdS7V0FSgbNbiVc9tIqqKUxfMyVecC/view?usp=drive_link",
        "pdfDownloadUrl": "https://drive.google.com/uc?export=download&id=1zHDdS7V0FSgbNbiVc9tIqqKUxfMyVecC",
        "coverImage": "https://lh3.googleusercontent.com/d/1zHDdS7V0FSgbNbiVc9tIqqKUxfMyVecC=s800",
        "fileId": "1zHDdS7V0FSgbNbiVc9tIqqKUxfMyVecC"
      },
      {
        "id": "mirage-cat-6",
        "title": "CATALOG 06",
        "pdfUrl": "https://drive.google.com/file/d/1D7Es1HNyuXAxrsLNv4omdCaG3bK3y9I6/view?usp=drive_link",
        "pdfDownloadUrl": "https://drive.google.com/uc?export=download&id=1D7Es1HNyuXAxrsLNv4omdCaG3bK3y9I6",
        "coverImage": "https://lh3.googleusercontent.com/d/1D7Es1HNyuXAxrsLNv4omdCaG3bK3y9I6=s800",
        "fileId": "1D7Es1HNyuXAxrsLNv4omdCaG3bK3y9I6"
      },
      {
        "id": "mirage-cat-7",
        "title": "CATALOG 07",
        "pdfUrl": "https://drive.google.com/file/d/1mzWnr22zYzR0W57teiiohXtE0iU9zgtX/view?usp=drive_link",
        "pdfDownloadUrl": "https://drive.google.com/uc?export=download&id=1mzWnr22zYzR0W57teiiohXtE0iU9zgtX",
        "coverImage": "https://lh3.googleusercontent.com/d/1mzWnr22zYzR0W57teiiohXtE0iU9zgtX=s800",
        "fileId": "1mzWnr22zYzR0W57teiiohXtE0iU9zgtX"
      },
      {
        "id": "mirage-cat-8",
        "title": "CATALOG 08",
        "pdfUrl": "https://drive.google.com/file/d/1PD6O5PW1tjdRjGzn0uPC0_qC5BDO4nLF/view?usp=drive_link",
        "pdfDownloadUrl": "https://drive.google.com/uc?export=download&id=1PD6O5PW1tjdRjGzn0uPC0_qC5BDO4nLF",
        "coverImage": "https://lh3.googleusercontent.com/d/1PD6O5PW1tjdRjGzn0uPC0_qC5BDO4nLF=s800",
        "fileId": "1PD6O5PW1tjdRjGzn0uPC0_qC5BDO4nLF"
      },
      {
        "id": "mirage-cat-9",
        "title": "CATALOG 09",
        "pdfUrl": "https://drive.google.com/file/d/1LbasBJrHWJccRKL_wD5CxtnGnqVhwTtp/view?usp=drive_link",
        "pdfDownloadUrl": "https://drive.google.com/uc?export=download&id=1LbasBJrHWJccRKL_wD5CxtnGnqVhwTtp",
        "coverImage": "https://lh3.googleusercontent.com/d/1LbasBJrHWJccRKL_wD5CxtnGnqVhwTtp=s800",
        "fileId": "1LbasBJrHWJccRKL_wD5CxtnGnqVhwTtp"
      }
    ]
  },
  {
    "id": "mafi",
    "name": "mafi",
    "category": "Wood Flooring \u00b7 Austria",
    "origin": "Austria",
    "estYear": "EST. 1997",
    "catalogCount": "2 catalogs",
    "filterTag": "Flooring",
    "catalogs": [
      {
        "id": "mafi-cat-1",
        "title": "CATALOG 01",
        "pdfUrl": "https://drive.google.com/file/d/1HbG9pFhTJN0NmbcbdXK4VI5LrmCc8EvQ/view?usp=drive_link",
        "pdfDownloadUrl": "https://drive.google.com/uc?export=download&id=1HbG9pFhTJN0NmbcbdXK4VI5LrmCc8EvQ",
        "coverImage": "https://lh3.googleusercontent.com/d/1HbG9pFhTJN0NmbcbdXK4VI5LrmCc8EvQ=s800",
        "fileId": "1HbG9pFhTJN0NmbcbdXK4VI5LrmCc8EvQ"
      },
      {
        "id": "mafi-cat-2",
        "title": "CATALOG 02",
        "pdfUrl": "https://drive.google.com/file/d/1g_r9kE4eZEnuPfUU69jLHlSiXoDY-fKQ/view?usp=drive_link",
        "pdfDownloadUrl": "https://drive.google.com/uc?export=download&id=1g_r9kE4eZEnuPfUU69jLHlSiXoDY-fKQ",
        "coverImage": "https://lh3.googleusercontent.com/d/1g_r9kE4eZEnuPfUU69jLHlSiXoDY-fKQ=s800",
        "fileId": "1g_r9kE4eZEnuPfUU69jLHlSiXoDY-fKQ"
      }
    ]
  },
  {
    "id": "inkiostro-bianco",
    "name": "Inkiostro Bianco",
    "category": "Wallcovering \u00b7 Italy",
    "origin": "Italy",
    "estYear": "EST. 2013",
    "catalogCount": "2 catalogs",
    "filterTag": "Surfaces",
    "catalogs": [
      {
        "id": "inkiostro-bianco-cat-1",
        "title": "CATALOG 01",
        "pdfUrl": "https://drive.google.com/file/d/1rTnaBdoFETY-zluvOsJ3DEPL1lFN7iM9/view?usp=drive_link",
        "pdfDownloadUrl": "https://drive.google.com/uc?export=download&id=1rTnaBdoFETY-zluvOsJ3DEPL1lFN7iM9",
        "coverImage": "https://lh3.googleusercontent.com/d/1rTnaBdoFETY-zluvOsJ3DEPL1lFN7iM9=s800",
        "fileId": "1rTnaBdoFETY-zluvOsJ3DEPL1lFN7iM9"
      },
      {
        "id": "inkiostro-bianco-cat-2",
        "title": "CATALOG 02",
        "pdfUrl": "https://drive.google.com/file/d/1V546MuJR4xYlk3Oys6T9567beAP2MeTp/view?usp=drive_link",
        "pdfDownloadUrl": "https://drive.google.com/uc?export=download&id=1V546MuJR4xYlk3Oys6T9567beAP2MeTp",
        "coverImage": "https://lh3.googleusercontent.com/d/1V546MuJR4xYlk3Oys6T9567beAP2MeTp=s800",
        "fileId": "1V546MuJR4xYlk3Oys6T9567beAP2MeTp"
      }
    ]
  },
  {
    "id": "fima",
    "name": "fima Carlo Frattini",
    "category": "Bathroom \u00b7 Italy",
    "origin": "Italy",
    "estYear": "EST. 1945",
    "catalogCount": "5 catalogs",
    "filterTag": "Bathroom",
    "catalogs": [
      {
        "id": "fima-cat-1",
        "title": "CATALOG 01",
        "pdfUrl": "https://drive.google.com/file/d/1MyDRmFqLK2vrEdE7Q3WhWKWQKerugPHQ/view?usp=drive_link",
        "pdfDownloadUrl": "https://drive.google.com/uc?export=download&id=1MyDRmFqLK2vrEdE7Q3WhWKWQKerugPHQ",
        "coverImage": "https://lh3.googleusercontent.com/d/1MyDRmFqLK2vrEdE7Q3WhWKWQKerugPHQ=s800",
        "fileId": "1MyDRmFqLK2vrEdE7Q3WhWKWQKerugPHQ"
      },
      {
        "id": "fima-cat-2",
        "title": "CATALOG 02",
        "pdfUrl": "https://drive.google.com/file/d/1FYHt8bOnM3KpPv7_zTHKkwf30fqTAcVx/view?usp=drive_link",
        "pdfDownloadUrl": "https://drive.google.com/uc?export=download&id=1FYHt8bOnM3KpPv7_zTHKkwf30fqTAcVx",
        "coverImage": "https://lh3.googleusercontent.com/d/1FYHt8bOnM3KpPv7_zTHKkwf30fqTAcVx=s800",
        "fileId": "1FYHt8bOnM3KpPv7_zTHKkwf30fqTAcVx"
      },
      {
        "id": "fima-cat-3",
        "title": "CATALOG 03",
        "pdfUrl": "https://drive.google.com/file/d/11r4Vl2V7vZPILHCrhFDvlOCKsbCbdJ0g/view?usp=drive_link",
        "pdfDownloadUrl": "https://drive.google.com/uc?export=download&id=11r4Vl2V7vZPILHCrhFDvlOCKsbCbdJ0g",
        "coverImage": "https://lh3.googleusercontent.com/d/11r4Vl2V7vZPILHCrhFDvlOCKsbCbdJ0g=s800",
        "fileId": "11r4Vl2V7vZPILHCrhFDvlOCKsbCbdJ0g"
      },
      {
        "id": "fima-cat-4",
        "title": "CATALOG 04",
        "pdfUrl": "https://drive.google.com/file/d/1KqtUlci2ec0smM6FiAMP7pKZitTV_Ddr/view?usp=drive_link",
        "pdfDownloadUrl": "https://drive.google.com/uc?export=download&id=1KqtUlci2ec0smM6FiAMP7pKZitTV_Ddr",
        "coverImage": "https://lh3.googleusercontent.com/d/1KqtUlci2ec0smM6FiAMP7pKZitTV_Ddr=s800",
        "fileId": "1KqtUlci2ec0smM6FiAMP7pKZitTV_Ddr"
      },
      {
        "id": "fima-cat-5",
        "title": "CATALOG 05",
        "pdfUrl": "https://drive.google.com/file/d/1fq7QFQ5pTbYNf3N7VHdrDRSBal86jeZz/view?usp=drive_link",
        "pdfDownloadUrl": "https://drive.google.com/uc?export=download&id=1fq7QFQ5pTbYNf3N7VHdrDRSBal86jeZz",
        "coverImage": "https://lh3.googleusercontent.com/d/1fq7QFQ5pTbYNf3N7VHdrDRSBal86jeZz=s800",
        "fileId": "1fq7QFQ5pTbYNf3N7VHdrDRSBal86jeZz"
      }
    ]
  },
  {
    "id": "formica",
    "name": "FORMICA\u00ae",
    "category": "Laminates & Surfaces \u00b7 Global",
    "origin": "Global",
    "estYear": "EST. 1913",
    "catalogCount": "5 catalogs",
    "filterTag": "Surfaces",
    "catalogs": [
      {
        "id": "formica-cat-1",
        "title": "CATALOG 01",
        "pdfUrl": "https://drive.google.com/file/d/1aDtHurtIb3rwATLdoa9kFWPGu1nXKfaR/view?usp=drive_link",
        "pdfDownloadUrl": "https://drive.google.com/uc?export=download&id=1aDtHurtIb3rwATLdoa9kFWPGu1nXKfaR",
        "coverImage": "https://lh3.googleusercontent.com/d/1aDtHurtIb3rwATLdoa9kFWPGu1nXKfaR=s800",
        "fileId": "1aDtHurtIb3rwATLdoa9kFWPGu1nXKfaR"
      },
      {
        "id": "formica-cat-2",
        "title": "CATALOG 02",
        "pdfUrl": "https://drive.google.com/file/d/1qJedyaeLI_EoZqNBXNj4K5uYn7ji7N60/view?usp=drive_link",
        "pdfDownloadUrl": "https://drive.google.com/uc?export=download&id=1qJedyaeLI_EoZqNBXNj4K5uYn7ji7N60",
        "coverImage": "https://lh3.googleusercontent.com/d/1qJedyaeLI_EoZqNBXNj4K5uYn7ji7N60=s800",
        "fileId": "1qJedyaeLI_EoZqNBXNj4K5uYn7ji7N60"
      },
      {
        "id": "formica-cat-3",
        "title": "CATALOG 03",
        "pdfUrl": "https://drive.google.com/file/d/1q8I_ygpc4Zb-grGss6bIlaqG61cYtnff/view?usp=drive_link",
        "pdfDownloadUrl": "https://drive.google.com/uc?export=download&id=1q8I_ygpc4Zb-grGss6bIlaqG61cYtnff",
        "coverImage": "https://lh3.googleusercontent.com/d/1q8I_ygpc4Zb-grGss6bIlaqG61cYtnff=s800",
        "fileId": "1q8I_ygpc4Zb-grGss6bIlaqG61cYtnff"
      },
      {
        "id": "formica-cat-4",
        "title": "CATALOG 04",
        "pdfUrl": "https://drive.google.com/file/d/1uqAJ9f3LrOA6RnmTSOs3a98iPopMxr_U/view?usp=drive_link",
        "pdfDownloadUrl": "https://drive.google.com/uc?export=download&id=1uqAJ9f3LrOA6RnmTSOs3a98iPopMxr_U",
        "coverImage": "https://lh3.googleusercontent.com/d/1uqAJ9f3LrOA6RnmTSOs3a98iPopMxr_U=s800",
        "fileId": "1uqAJ9f3LrOA6RnmTSOs3a98iPopMxr_U"
      },
      {
        "id": "formica-cat-5",
        "title": "CATALOG 05",
        "pdfUrl": "https://drive.google.com/file/d/1a2C5H0pvPxSxkVOVXEnJvw_ZULv3rxai/view?usp=drive_link",
        "pdfDownloadUrl": "https://drive.google.com/uc?export=download&id=1a2C5H0pvPxSxkVOVXEnJvw_ZULv3rxai",
        "coverImage": "https://lh3.googleusercontent.com/d/1a2C5H0pvPxSxkVOVXEnJvw_ZULv3rxai=s800",
        "fileId": "1a2C5H0pvPxSxkVOVXEnJvw_ZULv3rxai"
      }
    ]
  },
  {
    "id": "newtech-wood",
    "name": "NewTechWood",
    "category": "Cladding & Decking \u00b7 USA",
    "origin": "USA",
    "estYear": "EST. 2005",
    "catalogCount": "2 catalogs",
    "filterTag": "Cladding",
    "catalogs": [
      {
        "id": "newtechwood-cat-1",
        "title": "CATALOG 01",
        "pdfUrl": "https://drive.google.com/file/d/1PzAS2CRZQGMIZJjLfaJKchaq1wfIeJxy/view?usp=drive_link",
        "pdfDownloadUrl": "https://drive.google.com/uc?export=download&id=1PzAS2CRZQGMIZJjLfaJKchaq1wfIeJxy",
        "coverImage": "https://lh3.googleusercontent.com/d/1PzAS2CRZQGMIZJjLfaJKchaq1wfIeJxy=s800",
        "fileId": "1PzAS2CRZQGMIZJjLfaJKchaq1wfIeJxy"
      },
      {
        "id": "newtechwood-cat-2",
        "title": "CATALOG 02",
        "pdfUrl": "https://drive.google.com/file/d/1TJ8_oYGc3P-R0E96aD-tmthbg7aTg3-c/view?usp=drive_link",
        "pdfDownloadUrl": "https://drive.google.com/uc?export=download&id=1TJ8_oYGc3P-R0E96aD-tmthbg7aTg3-c",
        "coverImage": "https://lh3.googleusercontent.com/d/1TJ8_oYGc3P-R0E96aD-tmthbg7aTg3-c=s800",
        "fileId": "1TJ8_oYGc3P-R0E96aD-tmthbg7aTg3-c"
      }
    ]
  },
  {
    "id": "waltz",
    "name": "Waltz",
    "category": "Door & Partition \u00b7 Italy",
    "origin": "Italy",
    "estYear": "EST. 2005",
    "catalogCount": "5 catalogs",
    "filterTag": "Doors",
    "catalogs": [
      {
        "id": "waltz-cat-1",
        "title": "CATALOG 01",
        "pdfUrl": "https://drive.google.com/file/d/1JA_g_CemCX3fTMNxCgwUnvTDz7V5pjq7/view?usp=drive_link",
        "pdfDownloadUrl": "https://drive.google.com/uc?export=download&id=1JA_g_CemCX3fTMNxCgwUnvTDz7V5pjq7",
        "coverImage": "https://lh3.googleusercontent.com/d/1JA_g_CemCX3fTMNxCgwUnvTDz7V5pjq7=s800",
        "fileId": "1JA_g_CemCX3fTMNxCgwUnvTDz7V5pjq7"
      },
      {
        "id": "waltz-cat-2",
        "title": "CATALOG 02",
        "pdfUrl": "https://drive.google.com/file/d/1PKQ4DMTHtrBwlVsLXW5M_RLhiHkzUHCE/view?usp=drive_link",
        "pdfDownloadUrl": "https://drive.google.com/uc?export=download&id=1PKQ4DMTHtrBwlVsLXW5M_RLhiHkzUHCE",
        "coverImage": "https://lh3.googleusercontent.com/d/1PKQ4DMTHtrBwlVsLXW5M_RLhiHkzUHCE=s800",
        "fileId": "1PKQ4DMTHtrBwlVsLXW5M_RLhiHkzUHCE"
      },
      {
        "id": "waltz-cat-3",
        "title": "CATALOG 03",
        "pdfUrl": "https://drive.google.com/file/d/1jFT0QU2G7tra71rUxRenbhekvXjvFGTs/view?usp=drive_link",
        "pdfDownloadUrl": "https://drive.google.com/uc?export=download&id=1jFT0QU2G7tra71rUxRenbhekvXjvFGTs",
        "coverImage": "https://lh3.googleusercontent.com/d/1jFT0QU2G7tra71rUxRenbhekvXjvFGTs=s800",
        "fileId": "1jFT0QU2G7tra71rUxRenbhekvXjvFGTs"
      },
      {
        "id": "waltz-cat-4",
        "title": "CATALOG 04",
        "pdfUrl": "https://drive.google.com/file/d/1zNW6M4EKtsw3UUH6Hoyq1zihXo2ALki2/view?usp=drive_link",
        "pdfDownloadUrl": "https://drive.google.com/uc?export=download&id=1zNW6M4EKtsw3UUH6Hoyq1zihXo2ALki2",
        "coverImage": "https://lh3.googleusercontent.com/d/1zNW6M4EKtsw3UUH6Hoyq1zihXo2ALki2=s800",
        "fileId": "1zNW6M4EKtsw3UUH6Hoyq1zihXo2ALki2"
      },
      {
        "id": "waltz-cat-5",
        "title": "CATALOG 05",
        "pdfUrl": "https://drive.google.com/file/d/15P4PplYgb9PrPZlWudfHSiKbkexCBU1a/view?usp=drive_link",
        "pdfDownloadUrl": "https://drive.google.com/uc?export=download&id=15P4PplYgb9PrPZlWudfHSiKbkexCBU1a",
        "coverImage": "https://lh3.googleusercontent.com/d/15P4PplYgb9PrPZlWudfHSiKbkexCBU1a=s800",
        "fileId": "15P4PplYgb9PrPZlWudfHSiKbkexCBU1a"
      }
    ]
  },
  {
    "id": "slashform",
    "name": "slashform\u2122",
    "category": "Surfaces \u00b7 Italy",
    "origin": "Italy",
    "estYear": "EST. 2012",
    "catalogCount": "2 catalogs",
    "filterTag": "Surfaces",
    "catalogs": [
      {
        "id": "slashform-cat-1",
        "title": "CATALOG 01",
        "pdfUrl": "https://drive.google.com/file/d/11b9LnBC1UrF4QvFXYDGnewCUtWd_BphV/view?usp=drive_link",
        "pdfDownloadUrl": "https://drive.google.com/uc?export=download&id=11b9LnBC1UrF4QvFXYDGnewCUtWd_BphV",
        "coverImage": "https://lh3.googleusercontent.com/d/11b9LnBC1UrF4QvFXYDGnewCUtWd_BphV=s800",
        "fileId": "11b9LnBC1UrF4QvFXYDGnewCUtWd_BphV"
      },
      {
        "id": "slashform-cat-2",
        "title": "CATALOG 02",
        "pdfUrl": "https://drive.google.com/file/d/19n39_OGbW16iHUcAqeaxX9WhXLHKIrkd/view?usp=drive_link",
        "pdfDownloadUrl": "https://drive.google.com/uc?export=download&id=19n39_OGbW16iHUcAqeaxX9WhXLHKIrkd",
        "coverImage": "https://lh3.googleusercontent.com/d/19n39_OGbW16iHUcAqeaxX9WhXLHKIrkd=s800",
        "fileId": "19n39_OGbW16iHUcAqeaxX9WhXLHKIrkd"
      }
    ]
  },
  {
    "id": "wow",
    "name": "WOW",
    "category": "Decorative Tiles \u00b7 Spain",
    "origin": "Spain",
    "estYear": "EST. 2010",
    "catalogCount": "12 catalogs",
    "filterTag": "Surfaces",
    "catalogs": [
      {
        "id": "wow-cat-1",
        "title": "CATALOG 01",
        "pdfUrl": "https://drive.google.com/file/d/1R1gSFNQFJRLKLw_XWTY3Y6TngOk3Vse2/view?usp=drive_link",
        "pdfDownloadUrl": "https://drive.google.com/uc?export=download&id=1R1gSFNQFJRLKLw_XWTY3Y6TngOk3Vse2",
        "coverImage": "https://lh3.googleusercontent.com/d/1R1gSFNQFJRLKLw_XWTY3Y6TngOk3Vse2=s800",
        "fileId": "1R1gSFNQFJRLKLw_XWTY3Y6TngOk3Vse2"
      },
      {
        "id": "wow-cat-2",
        "title": "CATALOG 02",
        "pdfUrl": "https://drive.google.com/file/d/1awcMoYVr-IvlTcGG8cnCJUFSh9s8Dca0/view?usp=drive_link",
        "pdfDownloadUrl": "https://drive.google.com/uc?export=download&id=1awcMoYVr-IvlTcGG8cnCJUFSh9s8Dca0",
        "coverImage": "https://lh3.googleusercontent.com/d/1awcMoYVr-IvlTcGG8cnCJUFSh9s8Dca0=s800",
        "fileId": "1awcMoYVr-IvlTcGG8cnCJUFSh9s8Dca0"
      },
      {
        "id": "wow-cat-3",
        "title": "CATALOG 03",
        "pdfUrl": "https://drive.google.com/file/d/1MGpG7ObE8R93Dp4ECaoDOhzxBhpxINWq/view?usp=drive_link",
        "pdfDownloadUrl": "https://drive.google.com/uc?export=download&id=1MGpG7ObE8R93Dp4ECaoDOhzxBhpxINWq",
        "coverImage": "https://lh3.googleusercontent.com/d/1MGpG7ObE8R93Dp4ECaoDOhzxBhpxINWq=s800",
        "fileId": "1MGpG7ObE8R93Dp4ECaoDOhzxBhpxINWq"
      },
      {
        "id": "wow-cat-4",
        "title": "CATALOG 04",
        "pdfUrl": "https://drive.google.com/file/d/17NIm3CK1hJQegsyr0W15R1JyW9qPxtIY/view?usp=drive_link",
        "pdfDownloadUrl": "https://drive.google.com/uc?export=download&id=17NIm3CK1hJQegsyr0W15R1JyW9qPxtIY",
        "coverImage": "https://lh3.googleusercontent.com/d/17NIm3CK1hJQegsyr0W15R1JyW9qPxtIY=s800",
        "fileId": "17NIm3CK1hJQegsyr0W15R1JyW9qPxtIY"
      },
      {
        "id": "wow-cat-5",
        "title": "CATALOG 05",
        "pdfUrl": "https://drive.google.com/file/d/1UHpmBX4u4GJrAQpVAXsdHu8NbPWQAunN/view?usp=drive_link",
        "pdfDownloadUrl": "https://drive.google.com/uc?export=download&id=1UHpmBX4u4GJrAQpVAXsdHu8NbPWQAunN",
        "coverImage": "https://lh3.googleusercontent.com/d/1UHpmBX4u4GJrAQpVAXsdHu8NbPWQAunN=s800",
        "fileId": "1UHpmBX4u4GJrAQpVAXsdHu8NbPWQAunN"
      },
      {
        "id": "wow-cat-6",
        "title": "CATALOG 06",
        "pdfUrl": "https://drive.google.com/file/d/1By7CJZOiwUjf-KePFU0Uzu-dyO2dAwN9/view?usp=drive_link",
        "pdfDownloadUrl": "https://drive.google.com/uc?export=download&id=1By7CJZOiwUjf-KePFU0Uzu-dyO2dAwN9",
        "coverImage": "https://lh3.googleusercontent.com/d/1By7CJZOiwUjf-KePFU0Uzu-dyO2dAwN9=s800",
        "fileId": "1By7CJZOiwUjf-KePFU0Uzu-dyO2dAwN9"
      },
      {
        "id": "wow-cat-7",
        "title": "CATALOG 07",
        "pdfUrl": "https://drive.google.com/file/d/1CMSJMvIxpOWK8WAIvkYS7A5sF_Dr4K5-/view?usp=drive_link",
        "pdfDownloadUrl": "https://drive.google.com/uc?export=download&id=1CMSJMvIxpOWK8WAIvkYS7A5sF_Dr4K5-",
        "coverImage": "https://lh3.googleusercontent.com/d/1CMSJMvIxpOWK8WAIvkYS7A5sF_Dr4K5-=s800",
        "fileId": "1CMSJMvIxpOWK8WAIvkYS7A5sF_Dr4K5-"
      },
      {
        "id": "wow-cat-8",
        "title": "CATALOG 08",
        "pdfUrl": "https://drive.google.com/file/d/1PXKLlUgojb27V2N13-HE_IVANUzHvl8p/view?usp=drive_link",
        "pdfDownloadUrl": "https://drive.google.com/uc?export=download&id=1PXKLlUgojb27V2N13-HE_IVANUzHvl8p",
        "coverImage": "https://lh3.googleusercontent.com/d/1PXKLlUgojb27V2N13-HE_IVANUzHvl8p=s800",
        "fileId": "1PXKLlUgojb27V2N13-HE_IVANUzHvl8p"
      },
      {
        "id": "wow-cat-9",
        "title": "CATALOG 09",
        "pdfUrl": "https://drive.google.com/file/d/1WPSy9iHJmShxFztIfBirSpnP0Kgd1NFv/view?usp=drive_link",
        "pdfDownloadUrl": "https://drive.google.com/uc?export=download&id=1WPSy9iHJmShxFztIfBirSpnP0Kgd1NFv",
        "coverImage": "https://lh3.googleusercontent.com/d/1WPSy9iHJmShxFztIfBirSpnP0Kgd1NFv=s800",
        "fileId": "1WPSy9iHJmShxFztIfBirSpnP0Kgd1NFv"
      },
      {
        "id": "wow-cat-10",
        "title": "CATALOG 010",
        "pdfUrl": "https://drive.google.com/file/d/1IYLmJCC20WC2RoqcnIKmdkPyltchzlx0/view?usp=drive_link",
        "pdfDownloadUrl": "https://drive.google.com/uc?export=download&id=1IYLmJCC20WC2RoqcnIKmdkPyltchzlx0",
        "coverImage": "https://lh3.googleusercontent.com/d/1IYLmJCC20WC2RoqcnIKmdkPyltchzlx0=s800",
        "fileId": "1IYLmJCC20WC2RoqcnIKmdkPyltchzlx0"
      },
      {
        "id": "wow-cat-11",
        "title": "CATALOG 011",
        "pdfUrl": "https://drive.google.com/file/d/1JX0SFlcIelg8L7U8lhmNvLZqmKSICI_X/view?usp=drive_link",
        "pdfDownloadUrl": "https://drive.google.com/uc?export=download&id=1JX0SFlcIelg8L7U8lhmNvLZqmKSICI_X",
        "coverImage": "https://lh3.googleusercontent.com/d/1JX0SFlcIelg8L7U8lhmNvLZqmKSICI_X=s800",
        "fileId": "1JX0SFlcIelg8L7U8lhmNvLZqmKSICI_X"
      },
      {
        "id": "wow-cat-12",
        "title": "CATALOG 012",
        "pdfUrl": "https://drive.google.com/file/d/1g45Ay-Fbj0cjyP2spKceZNE76s2fJOc_/view?usp=drive_link",
        "pdfDownloadUrl": "https://drive.google.com/uc?export=download&id=1g45Ay-Fbj0cjyP2spKceZNE76s2fJOc_",
        "coverImage": "https://lh3.googleusercontent.com/d/1g45Ay-Fbj0cjyP2spKceZNE76s2fJOc_=s800",
        "fileId": "1g45Ay-Fbj0cjyP2spKceZNE76s2fJOc_"
      }
    ]
  },
  {
    "id": "agape",
    "name": "agape",
    "category": "Bathroom Fittings \u00b7 Italy",
    "origin": "Italy",
    "estYear": "EST. 1973",
    "catalogCount": "1 catalogs",
    "filterTag": "Bathroom",
    "catalogs": [
      {
        "id": "agape-cat-1",
        "title": "CATALOG 01",
        "pdfUrl": "https://drive.google.com/file/d/17pDn2JO8OFlKXJMTUeRSGUuNvWQxkoHJ/view?usp=drive_link",
        "pdfDownloadUrl": "https://drive.google.com/uc?export=download&id=17pDn2JO8OFlKXJMTUeRSGUuNvWQxkoHJ",
        "coverImage": "https://lh3.googleusercontent.com/d/17pDn2JO8OFlKXJMTUeRSGUuNvWQxkoHJ=s800",
        "fileId": "17pDn2JO8OFlKXJMTUeRSGUuNvWQxkoHJ"
      }
    ]
  },
  {
    "id": "iww",
    "name": "IWW",
    "category": "Architectural Wood \u00b7 Germany",
    "origin": "Germany",
    "estYear": "EST. 1995",
    "catalogCount": "10 catalogs",
    "filterTag": "Flooring",
    "catalogs": [
      {
        "id": "iww-cat-1",
        "title": "CATALOG 01",
        "pdfUrl": "https://drive.google.com/file/d/17EMc8hcG4wKxirEgSvNC-qpXs3gpsI__/view?usp=drive_link",
        "pdfDownloadUrl": "https://drive.google.com/uc?export=download&id=17EMc8hcG4wKxirEgSvNC-qpXs3gpsI__",
        "coverImage": "https://lh3.googleusercontent.com/d/17EMc8hcG4wKxirEgSvNC-qpXs3gpsI__=s800",
        "fileId": "17EMc8hcG4wKxirEgSvNC-qpXs3gpsI__"
      },
      {
        "id": "iww-cat-2",
        "title": "CATALOG 02",
        "pdfUrl": "https://drive.google.com/file/d/17OK3By3LEj1JeUQCWOunJuXRWPEDFzts/view?usp=drive_link",
        "pdfDownloadUrl": "https://drive.google.com/uc?export=download&id=17OK3By3LEj1JeUQCWOunJuXRWPEDFzts",
        "coverImage": "https://lh3.googleusercontent.com/d/17OK3By3LEj1JeUQCWOunJuXRWPEDFzts=s800",
        "fileId": "17OK3By3LEj1JeUQCWOunJuXRWPEDFzts"
      },
      {
        "id": "iww-cat-3",
        "title": "CATALOG 03",
        "pdfUrl": "https://drive.google.com/file/d/1snN0WQMAI_wXStlfIfnE_a9C7lQRJYNi/view?usp=drive_link",
        "pdfDownloadUrl": "https://drive.google.com/uc?export=download&id=1snN0WQMAI_wXStlfIfnE_a9C7lQRJYNi",
        "coverImage": "https://lh3.googleusercontent.com/d/1snN0WQMAI_wXStlfIfnE_a9C7lQRJYNi=s800",
        "fileId": "1snN0WQMAI_wXStlfIfnE_a9C7lQRJYNi"
      },
      {
        "id": "iww-cat-4",
        "title": "CATALOG 04",
        "pdfUrl": "https://drive.google.com/file/d/1t_qIyibYEUQoypj0-E5pBIEfL-feRCC9/view?usp=drive_link",
        "pdfDownloadUrl": "https://drive.google.com/uc?export=download&id=1t_qIyibYEUQoypj0-E5pBIEfL-feRCC9",
        "coverImage": "https://lh3.googleusercontent.com/d/1t_qIyibYEUQoypj0-E5pBIEfL-feRCC9=s800",
        "fileId": "1t_qIyibYEUQoypj0-E5pBIEfL-feRCC9"
      },
      {
        "id": "iww-cat-5",
        "title": "CATALOG 05",
        "pdfUrl": "https://drive.google.com/file/d/1IIFaKNrX224sfhVBQs1PFZNCodtWb6PV/view?usp=drive_link",
        "pdfDownloadUrl": "https://drive.google.com/uc?export=download&id=1IIFaKNrX224sfhVBQs1PFZNCodtWb6PV",
        "coverImage": "https://lh3.googleusercontent.com/d/1IIFaKNrX224sfhVBQs1PFZNCodtWb6PV=s800",
        "fileId": "1IIFaKNrX224sfhVBQs1PFZNCodtWb6PV"
      },
      {
        "id": "iww-cat-6",
        "title": "CATALOG 06",
        "pdfUrl": "https://drive.google.com/file/d/1hbazpk9aZOwqqK_xBZ7awRo-obdpxgHc/view?usp=drive_link",
        "pdfDownloadUrl": "https://drive.google.com/uc?export=download&id=1hbazpk9aZOwqqK_xBZ7awRo-obdpxgHc",
        "coverImage": "https://lh3.googleusercontent.com/d/1hbazpk9aZOwqqK_xBZ7awRo-obdpxgHc=s800",
        "fileId": "1hbazpk9aZOwqqK_xBZ7awRo-obdpxgHc"
      },
      {
        "id": "iww-cat-7",
        "title": "CATALOG 07",
        "pdfUrl": "https://drive.google.com/file/d/1jOm7QX8_wnAe4pV5pD8KAQdeJjNeNWIt/view?usp=drive_link",
        "pdfDownloadUrl": "https://drive.google.com/uc?export=download&id=1jOm7QX8_wnAe4pV5pD8KAQdeJjNeNWIt",
        "coverImage": "https://lh3.googleusercontent.com/d/1jOm7QX8_wnAe4pV5pD8KAQdeJjNeNWIt=s800",
        "fileId": "1jOm7QX8_wnAe4pV5pD8KAQdeJjNeNWIt"
      },
      {
        "id": "iww-cat-8",
        "title": "CATALOG 08",
        "pdfUrl": "https://drive.google.com/file/d/1Jkc4R5-p8Rmmo-9YckT8k0s_ycT2hXoI/view?usp=drive_link",
        "pdfDownloadUrl": "https://drive.google.com/uc?export=download&id=1Jkc4R5-p8Rmmo-9YckT8k0s_ycT2hXoI",
        "coverImage": "https://lh3.googleusercontent.com/d/1Jkc4R5-p8Rmmo-9YckT8k0s_ycT2hXoI=s800",
        "fileId": "1Jkc4R5-p8Rmmo-9YckT8k0s_ycT2hXoI"
      },
      {
        "id": "iww-cat-9",
        "title": "CATALOG 09",
        "pdfUrl": "https://drive.google.com/file/d/1CAjfcQBs-ifcj4SNdsRnK4HM1zDAeQ-z/view?usp=drive_link",
        "pdfDownloadUrl": "https://drive.google.com/uc?export=download&id=1CAjfcQBs-ifcj4SNdsRnK4HM1zDAeQ-z",
        "coverImage": "https://lh3.googleusercontent.com/d/1CAjfcQBs-ifcj4SNdsRnK4HM1zDAeQ-z=s800",
        "fileId": "1CAjfcQBs-ifcj4SNdsRnK4HM1zDAeQ-z"
      },
      {
        "id": "iww-cat-10",
        "title": "CATALOG 010",
        "pdfUrl": "https://drive.google.com/file/d/1BD5z3dOB6Y647bYx9lAu7S2uXWq9FY1d/view?usp=drive_link",
        "pdfDownloadUrl": "https://drive.google.com/uc?export=download&id=1BD5z3dOB6Y647bYx9lAu7S2uXWq9FY1d",
        "coverImage": "https://lh3.googleusercontent.com/d/1BD5z3dOB6Y647bYx9lAu7S2uXWq9FY1d=s800",
        "fileId": "1BD5z3dOB6Y647bYx9lAu7S2uXWq9FY1d"
      }
    ]
  },
  {
    "id": "bodaq",
    "name": "Bodaq",
    "category": "Interior Film \u00b7 Korea",
    "origin": "Korea",
    "estYear": "EST. 2002",
    "catalogCount": "1 catalogs",
    "filterTag": "Surfaces",
    "catalogs": [
      {
        "id": "bodaq-cat-1",
        "title": "CATALOG 01",
        "pdfUrl": "https://drive.google.com/file/d/1RuXXaltZ_wTUu2nLD1OTIscfvw0-9CmC/view?usp=drive_link",
        "pdfDownloadUrl": "https://drive.google.com/uc?export=download&id=1RuXXaltZ_wTUu2nLD1OTIscfvw0-9CmC",
        "coverImage": "https://lh3.googleusercontent.com/d/1RuXXaltZ_wTUu2nLD1OTIscfvw0-9CmC=s800",
        "fileId": "1RuXXaltZ_wTUu2nLD1OTIscfvw0-9CmC"
      }
    ]
  },
  {
    "id": "inclass",
    "name": "Inclass",
    "category": "Design Furniture \u00b7 Spain",
    "origin": "Spain",
    "estYear": "EST. 1998",
    "catalogCount": "1 catalogs",
    "filterTag": "Furniture",
    "catalogs": [
      {
        "id": "inclass-cat-1",
        "title": "CATALOG 01",
        "pdfUrl": "https://drive.google.com/file/d/1Jf3MZWsvoPwM0DpIIhGijSg4StaLoxg2/view?usp=drive_link",
        "pdfDownloadUrl": "https://drive.google.com/uc?export=download&id=1Jf3MZWsvoPwM0DpIIhGijSg4StaLoxg2",
        "coverImage": "https://lh3.googleusercontent.com/d/1Jf3MZWsvoPwM0DpIIhGijSg4StaLoxg2=s800",
        "fileId": "1Jf3MZWsvoPwM0DpIIhGijSg4StaLoxg2"
      }
    ]
  }
];

export default function BrandsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activePill, setActivePill] = useState("All");
  const [brands, setBrands] = useState<BrandItemData[]>(DEFAULT_BRANDS);
  const [allProducts, setAllProducts] = useState<ProductItem[]>([]);
  const [gateModalData, setGateModalData] = useState<{ pdfUrl: string; title: string } | null>(null);

  useEffect(() => {
    // Fetch Brands
    fetch("/api/brands?t=" + Date.now(), { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        if (json && json.success && Array.isArray(json.data) && json.data.length > 0) {
          const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, "");

          const apiBrands: BrandItemData[] = json.data.map((b: any, idx: number) => {
            const normName = normalize(b.name || "");
            const normId = normalize(b.id || "");
            const defaultMatch = DEFAULT_BRANDS.find(
              (db) => normalize(db.name) === normName || normalize(db.id) === normId || normName.includes(normalize(db.id)) || normalize(db.id).includes(normName)
            );
            return {
              id: defaultMatch?.id || b.id || b.name.toLowerCase().replace(/\s+/g, "-"),
              name: b.name.toUpperCase(),
              category: b.description || defaultMatch?.category || "Surface Solution · Global",
              origin: defaultMatch?.origin || "Global",
              estYear: defaultMatch?.estYear || `EST. ${1970 + ((idx * 3) % 45)}`,
              catalogCount: defaultMatch?.catalogCount || "3 catalogs",
              filterTag: defaultMatch?.filterTag || "Surfaces",
              catalogs: defaultMatch?.catalogs || [
                { title: "COLLECTION 2025", themeClass: "ct-dark" },
                { title: "PRODUCT SPEC", themeClass: "ct-cream" },
              ],
            };
          });

          const seen = new Set<string>();
          const merged: BrandItemData[] = [];

          [...apiBrands, ...DEFAULT_BRANDS].forEach((item) => {
            const key = normalize(item.id) || normalize(item.name);
            if (!seen.has(key)) {
              seen.add(key);
              merged.push(item);
            }
          });

          setBrands(merged);
        }
      })
      .catch((err) => console.error(err));

    // Fetch Products
    fetch("/api/products?t=" + Date.now(), { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        if (json && json.success && Array.isArray(json.data)) {
          setAllProducts(json.data);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const filteredBrands = brands.filter((brand) => {
    const matchesPill = activePill === "All" || brand.filterTag.toLowerCase() === activePill.toLowerCase() || brand.category.toLowerCase().includes(activePill.toLowerCase());
    const matchesQuery =
      !searchQuery ||
      brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brand.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPill && matchesQuery;
  });

  const totalCatalogsCount = filteredBrands.reduce((acc, b) => acc + (parseInt(b.catalogCount) || b.catalogs.length), 0);

  // Helper to get brand products
  const getBrandProducts = (brand: BrandItemData): ProductItem[] => {
    const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
    const targetBrand = norm(brand.name);
    const targetId = norm(brand.id);

    let list = allProducts.filter((p) => {
      const pBrand = norm(p.brand || "");
      return pBrand.includes(targetBrand) || targetBrand.includes(pBrand) || pBrand.includes(targetId);
    });

    // If fewer than 10 products, generate synthetic catalog products for rich UI demonstration
    if (list.length < 10) {
      const needed = 12 - list.length;
      const categories = ["Decking", "Cladding", "Surfaces", "Flooring", "Bathroom", "Tiles", "Doors"];
      const colors = ["#2b3a4a", "#8c764b", "#3b4d3c", "#4a3b32", "#1e293b", "#d97706", "#475569", "#78350f", "#0f766e"];
      
      const extra: ProductItem[] = Array.from({ length: needed }).map((_, i) => {
        const pIdx = list.length + i + 1;
        const cat = categories[i % categories.length];
        const hex = colors[i % colors.length];
        return {
          id: `${brand.id}-prod-${pIdx}`,
          name: `${brand.name} Line ${pIdx}`,
          brand: brand.name,
          category: cat,
          description: `${brand.name} architectural ${cat.toLowerCase()} series`,
          imageUrl: pIdx % 2 === 0 ? "/brands/brand_1_1.png" : "",
          coverColor: hex,
          qtyInStock: 10,
        } as ProductItem & { coverColor?: string };
      });
      return [...list, ...extra];
    }

    return list;
  };

  return (
    <div className="page-wrapper">
      <div className="page">
        {/* ── Hero Section ── */}
        <div className="hero">
          <div className="hero-label">AAREN Studio — Material House</div>
          <h1 className="hero-title">Brands</h1>
          <p className="hero-sub">Curated luxury materials, surfaces &amp; systems from the world&apos;s finest manufacturers</p>
        </div>

        {/* ── Controls Bar ── */}
        <div className="controls">
          <div className="search-wrap">
            <Search className="search-icon" size={15} />
            <input
              className="search-inp"
              placeholder="Search brands..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-pills">
            {FILTER_PILLS.map((pill) => (
              <button
                key={pill}
                className={`pill${activePill === pill ? " active" : ""}`}
                onClick={() => setActivePill(pill)}
              >
                {pill}
              </button>
            ))}
          </div>

          <div className="count-label">
            {filteredBrands.length} Brands · {totalCatalogsCount} Catalogs
          </div>
        </div>

        {/* ── Brands Grid ── */}
        <div className="brands-grid">
          {filteredBrands.map((brand, idx) => {
            const brandProds = getBrandProducts(brand);
            const totalCount = Math.max(brandProds.length, parseInt(brand.catalogCount) * 2 || 12);
            const showingProds = brandProds.slice(0, 10);
            const hasMore = totalCount > 10;

            return (
              <div key={`${brand.id}-${idx}`} className="brand-card">
                {/* Brand Header */}
                <div className="brand-header">
                  <div className="brand-logo-area">
                    <div style={{ height: "36px", display: "flex", alignItems: "center", marginBottom: "4px" }}>
                      <Image
                        src={`/brand_logos/${brand.id}.png`}
                        alt={brand.name}
                        width={140}
                        height={36}
                        style={{ objectFit: "contain", objectPosition: "left center" }}
                        onError={(e: any) => {
                          // Fallback to text if image missing
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                    <div className="brand-logo">{brand.name}</div>
                    <div className="brand-category">{brand.category}</div>
                  </div>
                  <div className="brand-count">{brand.catalogCount}</div>
                </div>

                {/* Catalogs Row — First Page PDF Previews from Excel */}
                <div
                  className="catalogs-row"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
                    gap: "10px",
                    marginTop: "14px",
                  }}
                >
                  {brand.catalogs.map((cat, cIdx) => {
                    const hasCover = Boolean(cat.coverImage);
                    const pdfHref = cat.pdfUrl || cat.pdfDownloadUrl || "#";

                    return (
                      <a
                        key={cIdx}
                        href={pdfHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="catalog-pdf-card"
                        title={`Open ${cat.title}`}
                        onClick={(e) => {
                          e.preventDefault();
                          const pdfToOpen = cat.pdfDownloadUrl || cat.pdfUrl || `/catalogues/${brand.id}.pdf`;
                          setGateModalData({
                            pdfUrl: pdfToOpen,
                            title: `${brand.name} - ${cat.title}`,
                          });
                        }}
                        style={{
                          position: "relative",
                          aspectRatio: "3/4",
                          borderRadius: "6px",
                          overflow: "hidden",
                          border: "0.5px solid var(--border)",
                          background: "var(--surface-1)",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          padding: "8px",
                          textDecoration: "none",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                          transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        }}
                      >
                        {hasCover ? (
                          <Image
                            src={cat.coverImage!}
                            alt={cat.title}
                            fill
                            sizes="(max-width: 768px) 50vw, 20vw"
                            style={{ objectFit: "cover", zIndex: 0 }}
                            unoptimized
                          />
                        ) : (
                          <div
                            style={{
                              position: "absolute",
                              inset: 0,
                              background: "linear-gradient(135deg, #1f2937, #111827)",
                              zIndex: 0,
                            }}
                          />
                        )}

                        {/* Top PDF Badge */}
                        <div
                          style={{
                            position: "relative",
                            zIndex: 2,
                            alignSelf: "flex-start",
                            background: "rgba(0,0,0,0.75)",
                            color: "#fff",
                            fontSize: "8px",
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            padding: "3px 6px",
                            borderRadius: "3px",
                            backdropFilter: "blur(4px)",
                            textTransform: "uppercase",
                          }}
                        >
                          PDF · Pg 1
                        </div>

                        {/* Bottom Label Bar */}
                        <div
                          style={{
                            position: "relative",
                            zIndex: 2,
                            background: "rgba(0,0,0,0.68)",
                            color: "#ffffff",
                            padding: "6px 8px",
                            borderRadius: "4px",
                            backdropFilter: "blur(6px)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "10px",
                              fontWeight: 600,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              letterSpacing: "0.02em",
                            }}
                          >
                            {cat.title}
                          </span>
                          <span style={{ fontSize: "9px", opacity: 0.8 }}>↳</span>
                        </div>
                      </a>
                    );
                  })}
                </div>

                {/* Brand Link Footer */}
                <div className="brand-footer">
                  <Link href={`/brands/${brand.id}`} className="view-link">
                    <ArrowRight size={12} style={{ marginRight: "4px" }} /> View brand
                  </Link>
                  <div className="origin-tag">{brand.estYear}</div>
                </div>

                {/* 1. HAIRLINE DIVIDER */}
                <div className="brand-divider" style={{ height: "0.5px", background: "var(--border)", margin: "16px 0" }} />

                {/* 2. PRODUCTS SECTION */}
                <div className="brand-products-section" style={{ padding: "0 4px" }}>
                  <div className="brand-products-header" style={{ marginBottom: "12px" }}>
                    <span style={{ fontSize: "10px", textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.1em", fontWeight: 600 }}>
                      Products — {totalCount} total, showing {showingProds.length}
                    </span>
                  </div>

                  {/* Mini Product Grid: 5 columns */}
                  <div className="mini-product-grid">
                    {showingProds.map((prod) => {
                      const coverColor = (prod as any).coverColor || "#e2e8f0";
                      const prodSlug = prod.id || prod.name.toLowerCase().replace(/\s+/g, "-");

                      return (
                        <Link
                          key={prod.id}
                          href={`/products/${prodSlug}`}
                          className="mini-product-card"
                        >
                          <div
                            className="mini-product-thumb"
                            style={{
                              aspectRatio: "1",
                              borderRadius: "4px",
                              overflow: "hidden",
                              position: "relative",
                              background: coverColor,
                            }}
                          >
                            {prod.imageUrl && prod.imageUrl !== "/brands/brand_1_1.png" ? (
                              <Image
                                src={prod.imageUrl}
                                alt={prod.name}
                                fill
                                sizes="100px"
                                style={{ objectFit: "cover" }}
                              />
                            ) : null}
                          </div>

                          <div className="mini-product-info" style={{ marginTop: "6px" }}>
                            <div className="mini-product-name" style={{ fontSize: "9px", fontWeight: 500, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {prod.name}
                            </div>
                            <div className="mini-product-tag-wrap" style={{ marginTop: "3px" }}>
                              <span className="mini-product-tag" style={{ fontSize: "8px", background: "var(--surface-2)", color: "var(--text-secondary)", padding: "2px 6px", borderRadius: "10px", display: "inline-block" }}>
                                {prod.category}
                              </span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* 3. MORE BAR (if > 10 products) */}
                {hasMore && (
                  <div
                    className="brand-more-bar"
                    style={{
                      marginTop: "16px",
                      background: "var(--surface-1)",
                      border: "0.5px solid var(--border)",
                      borderRadius: "6px",
                      padding: "10px 14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 500 }}>
                      Showing {showingProds.length} of {totalCount} products
                    </span>
                    <Link
                      href={`/products?brand=${brand.id}`}
                      className="brand-more-btn"
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "#8c764b",
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      View all products →
                    </Link>
                  </div>
                )}
              </div>
            );
          })}

          {/* Placeholder Footer Block */}
          <div className="placeholder-more">
            <span>+ 8 more brands — Agape, IW, Bodaq, Inclass Veneer, Inkiostro Bianco, Falper, Loco Design, Fenix</span>
          </div>
        </div>

        {/* ── Page Footer ── */}
        <div className="page-footer">
          <div className="left">AAREN © 2026 · Creative Studio &amp; Material House</div>
          <div className="right">
            <span>{brands.length} Brands</span>
            <span>{totalCatalogsCount}+ Catalogs</span>
            <span>300+ Products</span>
          </div>
        </div>
      </div>

      {/* ── Catalog PDF Gate Modal ── */}
      {gateModalData && (
        <CatalogPdfGateModal
          catalogPdfUrl={gateModalData.pdfUrl}
          itemTitle={gateModalData.title}
          onClose={() => setGateModalData(null)}
        />
      )}

      <style jsx global>{`
        :root {
          --surface-0: #f8fafc;
          --surface-1: #ffffff;
          --surface-2: #f1f5f9;
          --border: #e2e8f0;
          --border-strong: #cbd5e1;
          --text-primary: #0f172a;
          --text-secondary: #475569;
          --text-muted: #94a3b8;
          --radius: 6px;
        }

        .page-wrapper {
          background: var(--surface-0);
          color: var(--text-primary);
          min-height: 100vh;
          padding-top: 5rem;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .page {
          max-width: 100%;
        }

        .hero {
          padding: 64px 32px 40px;
          border-bottom: 0.5px solid var(--border);
          background: #ffffff;
        }

        .hero-label {
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #8c764b;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .hero-title {
          font-size: clamp(36px, 6vw, 64px);
          font-weight: 700;
          line-height: 0.95;
          letter-spacing: -0.03em;
          color: var(--text-primary);
          text-transform: uppercase;
        }

        .hero-sub {
          font-size: 15px;
          color: var(--text-secondary);
          margin-top: 12px;
          max-width: 600px;
          line-height: 1.5;
        }

        .controls {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px 32px;
          border-bottom: 0.5px solid var(--border);
          background: #ffffff;
          flex-wrap: wrap;
        }

        .search-wrap {
          flex: 1;
          min-width: 220px;
          position: relative;
        }

        .search-wrap :global(.search-icon) {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
        }

        .search-inp {
          width: 100%;
          padding: 9px 12px 9px 36px;
          font-size: 13px;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          background: var(--surface-2);
          color: var(--text-primary);
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }

        .search-inp:focus {
          border-color: #8c764b;
          background: #ffffff;
        }

        .filter-pills {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .pill {
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 6px 14px;
          border-radius: 20px;
          border: 1px solid var(--border);
          cursor: pointer;
          color: var(--text-secondary);
          background: transparent;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .pill:hover {
          border-color: #8c764b;
          color: #8c764b;
        }

        .pill.active {
          background: #8c764b;
          color: #ffffff;
          border-color: #8c764b;
        }

        .count-label {
          font-size: 12px;
          color: var(--text-muted);
          margin-left: auto;
          white-space: nowrap;
          font-weight: 600;
        }

        .brands-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 1px;
          background: var(--border);
          padding: 0;
        }

        .brand-card {
          background: var(--surface-1);
          padding: 28px 24px 24px;
          transition: background 0.2s ease, transform 0.2s ease;
          position: relative;
          color: inherit;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .brand-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .brand-logo-area {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .brand-logo {
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--text-primary);
          text-transform: uppercase;
        }

        .brand-category {
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-muted);
          font-weight: 600;
        }

        .brand-count {
          font-size: 11px;
          color: #8c764b;
          background: #fef3c7;
          border: 1px solid #fde68a;
          border-radius: 20px;
          padding: 4px 10px;
          white-space: nowrap;
          font-weight: 700;
        }

        .catalogs-row {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
        }

        .catalog-thumb {
          flex: 1;
          aspect-ratio: 0.7;
          border-radius: 4px;
          border: 0.5px solid rgba(0,0,0,0.1);
          display: flex;
          align-items: flex-end;
          padding: 10px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 2px 6px rgba(0,0,0,0.06);
        }

        .catalog-thumb .cat-title {
          position: relative;
          z-index: 1;
          font-size: 10px;
          letter-spacing: 0.05em;
          font-weight: 800;
          line-height: 1.3;
          text-transform: uppercase;
        }

        .ct-dark { background: #111111; }
        .ct-dark .cat-title { color: #ffffff; }

        .ct-cream { background: #e8e2d9; }
        .ct-cream .cat-title { color: #333333; }

        .ct-sand { background: #c9b89a; }
        .ct-sand .cat-title { color: #2a1f0e; }

        .ct-slate { background: #4a5568; }
        .ct-slate .cat-title { color: #e2e8f0; }

        .ct-green { background: #1a3d2b; }
        .ct-green .cat-title { color: #a8d5b5; }

        .ct-taupe { background: #8d7b6a; }
        .ct-taupe .cat-title { color: #f5f0eb; }

        .ct-warm { background: #8c764b; }
        .ct-warm .cat-title { color: #ffffff; }

        .ct-navy { background: #1e2d4e; }
        .ct-navy .cat-title { color: #b8c8e8; }

        .ct-rose { background: #c44b6c; }
        .ct-rose .cat-title { color: #ffe0ea; }

        .brand-footer {
          margin-top: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .view-link {
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #8c764b;
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: 700;
          text-decoration: none;
        }

        .origin-tag {
          font-size: 10px;
          color: var(--text-muted);
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        /* Mini Product Grid */
        .mini-product-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 8px;
        }

        .mini-product-card {
          border: 0.5px solid var(--border);
          border-radius: 6px;
          padding: 6px;
          background: #ffffff;
          text-decoration: none;
          transition: border-color 0.2s ease, transform 0.2s ease;
        }

        .mini-product-card:hover {
          border-color: var(--border-strong);
          transform: translateY(-2px);
        }

        .placeholder-more {
          grid-column: 1 / -1;
          background: var(--surface-1);
          padding: 36px 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .placeholder-more span {
          font-size: 13px;
          color: var(--text-secondary);
          border: 1px dashed var(--border-strong);
          border-radius: 6px;
          padding: 16px 32px;
          font-weight: 600;
          text-align: center;
        }

        .page-footer {
          padding: 28px 32px;
          border-top: 0.5px solid var(--border);
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .page-footer .left {
          font-size: 12px;
          color: var(--text-muted);
        }

        .page-footer .right {
          font-size: 12px;
          color: var(--text-secondary);
          display: flex;
          gap: 20px;
          font-weight: 600;
        }

        @media (max-width: 640px) {
          .hero { padding: 40px 16px 24px; }
          .controls { padding: 16px; }
          .brands-grid { grid-template-columns: 1fr; }
          .mini-product-grid { grid-template-columns: repeat(3, 1fr); }
          .page-footer { padding: 20px 16px; }
        }
      `}</style>
    </div>
  );
}

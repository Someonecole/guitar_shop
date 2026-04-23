import React from "react";
import { Link } from "react-router-dom";
import { t } from "../../i18n/t";

export default function AdminDashboard() {
  return (
    <div className="container-app py-6">
      <div className="card p-6">
        <div className="text-lg font-semibold">{t("admin.dashboard")}</div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link className="btn btn-ghost" to="/admin/products">
            {t("admin.products")}
          </Link>
          <Link className="btn btn-ghost" to="/admin/orders">
            {t("admin.orders")}
          </Link>
        </div>
      </div>
    </div>
  );
}
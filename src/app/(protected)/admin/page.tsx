"use client";

import { RoleGate } from "@/components/auth/role-gate";
import {UserRoleEnum} from "@/lib/db/schemas/auth";

const AdminPage = () => {

    return (
        <RoleGate allowedRole={UserRoleEnum.ADMIN}>
            Admin
        </RoleGate>
    );
};

export default AdminPage;

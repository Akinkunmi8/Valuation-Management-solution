import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { ROUTES } from '@/shared/constants/routes'
import Button from '@/shared/ui/button/Button'
import { IoArrowBackCircleOutline } from "react-icons/io5";

import { AppLoader } from '@/shared/ui/loader'
import {
    Card, CardContent,
    // CardHeader, CardTitle
} from '@/shared/ui/card/Card'
import CustomerTab from '@/features/facilities/workspace/CustomerTab';
import CollateralTab from '@/features/facilities/workspace/CollateralTab';

import DocumentsTab from '@/features/facilities/workspace/DocumentsTab';
import { VALUER_WORKSPACE_TABS } from '../constants/ValuerWorkSpaceTabs';

import { useAppSelector } from '@/app/store/hooks';
import StatusBadge from '@/shared/ui/badge/Badge';
import { getHomeRoute } from '@/shared/utils/getHomeRoute';
import { useGetFacilityDetailsQuery } from '@/features/facilities/api/facilityApi';
import { getApprovalStatus } from '@/features/valuations/utilis/status';

import ValuerOverviewTab from '../constants/ValuerOverviewTab';
import ValuersReportTab from '../components/ValuersReportTab';




const ValuerFacilityDetailsPage = () => {
    const navigate = useNavigate()

    const {
        roles,
    } = useAppSelector(
        state => state.auth,
    )

    const activeRole = roles[0]

    const TABS = VALUER_WORKSPACE_TABS;



    const [activeTab, setActiveTab] =
        useState<(typeof VALUER_WORKSPACE_TABS)[number]["id"]>("overview");

    const {
        facilityReference,
    } = useParams()

    const {
        data: facility,
        isLoading,
        isError
    } =
        useGetFacilityDetailsQuery(
            facilityReference!,
        )

    if (isLoading) {
        return <AppLoader />
    }

    if (isError || !facility) {
        return (
            <Card>

                <CardContent className="py-12 text-center">

                    <h2 className="text-xl font-semibold text-text-primary">
                        Facility not found
                    </h2>

                    <p className="mt-2 text-text-secondary">
                        Unable to load this facility.
                    </p>

                    <Button
                        className="mt-6"
                        onClick={() =>
                            navigate(
                                ROUTES.rm.facilities,
                            )
                        }
                    >
                        Back to Facilities
                    </Button>

                </CardContent>

            </Card>
        )
    }

    const renderContent = () => {
        switch (activeTab) {

            case 'overview':
                return (
                    <ValuerOverviewTab
                        facility={facility}
                    />
                )

            case 'customer':
                return (
                    <CustomerTab
                        facility={facility}
                    />
                )

            case 'collateral':
                return (
                    <CollateralTab
                        facility={facility}
                    />
                )

            case 'documents':
                return (
                    <DocumentsTab
                        facility={facility}
                    />
                )

            case "report":
                return (
                    <ValuersReportTab/>
                );



            default:
                return null
        }
    }



    return (
        <div className="space-y-6">
            <Link to={getHomeRoute(activeRole)}
                className='flex items-center gap-2'
            >
                <IoArrowBackCircleOutline />
                <>Back</>
            </Link>

            <div className="space-y-2">
                <p className="text-sm text-text-muted">
                    Facility Reference
                </p>

                <h1 className="text-3xl font-bold">
                    {facilityReference}
                </h1>

                <div className="mt-2">
                    <StatusBadge
                        {...getApprovalStatus(
                            facility.approvalStatus,
                        )}
                    />
                </div>
            </div>


            <div className="flex gap-2 border-b border-border">

                {TABS.map(tab => (

                    <button
                        key={tab.id}
                        onClick={() =>
                            setActiveTab(tab.id)
                        }
                        className={`
                px-4
                py-3
                text-sm
                font-medium
                transition
                cursor-pointer
                ${activeTab === tab.id
                                ? 'border-b-2 border-primary text-primary'
                                : 'text-text-secondary hover:text-text-primary'
                            }
            `}
                    >
                        {tab.label}
                    </button>

                ))}

            </div>

            <div className="rounded-2xl border border-border bg-surface p-6">
                {renderContent()}
            </div>
        </div>
    )
}

export default ValuerFacilityDetailsPage
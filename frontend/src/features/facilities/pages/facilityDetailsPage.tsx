import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { ROUTES } from '../../../shared/constants/routes'
import Button from '../../../shared/ui/button/Button'
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useGetFacilityDetailsQuery } from '../api/facilityApi'
import { AppLoader } from '../../../shared/ui/loader'
import {
    Card, CardContent,
    // CardHeader, CardTitle
} from '../../../shared/ui/card/Card'
import CustomerTab from '../workspace/CustomerTab'
import CollateralTab from '../workspace/CollateralTab'
import OverviewTab from '../workspace/OverviewTab'
import DocumentsTab from '../workspace/DocumentsTab'
import PaymentTab from '../../payments/components/PaymentTab'


const TABS = [
    {
        id: 'overview',
        label: 'Overview',
    },
    {
        id: 'customer',
        label: 'Customer',
    },

    {
        id: 'collateral',
        label: 'Collateral',
    },

    {
        id: 'documents',
        label: 'Documents',
    },

    {
        id: 'payment',
        label: 'Payment',
    },
]



const FacilityDetailsPage = () => {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] =
        useState<
            typeof TABS[number]['id']
        >('overview')

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
                    <OverviewTab
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

            case 'payment':
                return (
                    <PaymentTab
                    facility={facility}
                    />
                )

            default:
                return null
        }
    }

    return (
        <div className="space-y-6">
            <Link to={ROUTES.rm.facilities}
                className='flex items-center gap-2'
            >
                <IoArrowBackCircleOutline />
                <>Back to Facilities</>
            </Link>

            <div className="space-y-2">
                <p className="text-sm text-text-muted">
                    Facility Reference
                </p>

                <h1 className="text-3xl font-bold">
                    {facilityReference}
                </h1>

                <p className="text-sm text-warning">
                    Pending Approval
                </p>
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

export default FacilityDetailsPage
import { useParams } from 'react-router'

const FacilityDetailsPage = () => {

    const {
        facilityReference,
    } = useParams()

    return (

        <div className="space-y-6">

            <h1 className="text-3xl font-bold">

                Facility

            </h1>

            <p>

                {facilityReference}

            </p>

        </div>

    )

}

export default FacilityDetailsPage
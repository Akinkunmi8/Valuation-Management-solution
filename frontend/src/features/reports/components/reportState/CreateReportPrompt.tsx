import { FiEdit3, FiFileText } from "react-icons/fi";
import { useNavigate } from "react-router";

import Button from "@/shared/ui/button/Button";
import { ROUTES } from "@/shared/constants/routes";

type Props = {
    facilityReference: string;
};

const CreateReportPrompt = ({
    facilityReference,
}: Props) => {

    const navigate = useNavigate();

    return (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10">

            <div className="mx-auto flex max-w-lg flex-col items-center text-center">

                <div className="mb-5 rounded-full bg-primary/10 p-4 text-primary">
                    <FiFileText size={36} />
                </div>

                <h2 className="text-2xl font-semibold">
                    Valuation Report
                </h2>

                <p className="mt-3 text-sm text-text-secondary">
                    No valuation report has been submitted for this
                    facility yet.
                </p>

                <p className="mt-2 text-sm text-text-muted">
                    Click the button below to create and submit the
                    valuation report.
                </p>

                <Button
                    className="mt-8"
                    leftIcon={<FiEdit3 />}
                    onClick={() =>
                        navigate(
                            ROUTES.valuer.reportsSubmitEdit.replace(
                                ":facilityReference",
                                facilityReference,
                            ),
                        )
                    }
                >
                    Create Report
                </Button>

            </div>

        </div>
    );
};

export default CreateReportPrompt;
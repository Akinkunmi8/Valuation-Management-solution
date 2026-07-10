import './loader.css'

type AppLoaderProps = {
    message?: string
}

const AppLoader = ({
    message = 'Preparing ValuationHub...',
}: AppLoaderProps) => {
    return (
        <div className="vh-loader">

            <div className="vh-logo-wrapper">

                <div className="vh-orbit">

                    <span className="vh-dot dot1" />
                    <span className="vh-dot dot2" />
                    <span className="vh-dot dot3" />
                    <span className="vh-dot dot4" />

                </div>

                <div className="vh-logo">

                    <span className="vh-text">
                        VH
                    </span>

                </div>

            </div>


            <p className="vh-message">
                {message}
            </p>
        </div>
    )
}

export default AppLoader
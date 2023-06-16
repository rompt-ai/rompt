import { Details } from "./Details"

export function CreateExperimentRouter() {
    return <Details />
}

// import { useContext } from "react"
// import { Wand2 } from "lucide-react"

// import { CreateExperimentContext } from "../context/CreateExperimentContext"
// import { Details } from "./Details"
// import { Discover } from "./Discover"
// import { VerticalStepper } from "./VerticalStepper"

// export function CreateExperimentRouter() {
//     const { currentStep, setActiveStep } = useContext(CreateExperimentContext)

//     const steps = [
//         { title: "Details" },
//         {
//             title: (
//                 <span className='flex items-center'>
//                     Discover&nbsp;&nbsp;
//                     <Wand2 size={14} />
//                 </span>
//             ),
//         },
//     ]

//     return (
//         <>
//             <div className='inline-block'>
//                 {currentStep === 0 && <Details />}
//                 {currentStep === 1 && <Discover />}
//             </div>
//             <div className='ml-32 inline-block align-top'>
//                 <VerticalStepper steps={steps} currentStep={currentStep} onChangeStep={setActiveStep} />
//             </div>
//         </>
//     )
// }

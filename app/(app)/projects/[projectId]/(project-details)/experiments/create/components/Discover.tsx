export const noop = () => {}

// "use client"

// import { useContext } from "react"
// import { ArrowRight, HelpCircle } from "lucide-react"

// import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Switch } from "@/components/ui/switch"
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// import { selectProps } from "@/components/selectProps"

// import { CreateExperimentContext } from "../context/CreateExperimentContext"

// export function Discover() {
//     const {
//         nMagicVariables,
//         setNMagicVariables,
//         nMagicPrompts,
//         setNMagicPrompts,
//         sendCreateExperiment,
//         isCreateExperimentLoading
//     } = useContext(CreateExperimentContext)

//     return (
//         <div className='inline-block w-full max-w-[410px] space-y-8'>
//             <div className='grid gap-2'>
//                 <Label className='inline-block'>
//                     Variable generation &nbsp;
//                     <TooltipProvider delayDuration={0}>
//                         <Tooltip>
//                             <TooltipTrigger asChild>
//                                 <HelpCircle className='inline-block align-top' size={14} />
//                             </TooltipTrigger>
//                             <TooltipContent {...selectProps()} style={{ maxWidth: 200 }}>
//                                 <small className='text-xs font-medium leading-none'>
//                                     For example, if you have a prompt that says &ldquo;I&apos;m <span className='italic'>{`{MOD}`}</span>{" "}
//                                     hungry&rdquo;, Rompt may generate variations like &ldquo;I&apos;m <span className='italic'>very</span>{" "}
//                                     hungry&rdquo; or &ldquo;I&apos;m <span className='italic'>not that</span> hungry&rdquo;.
//                                 </small>
//                             </TooltipContent>
//                         </Tooltip>
//                     </TooltipProvider>
//                 </Label>
//                 <p className='text-sm text-slate-500'>
//                     {`Generate variables, and corresponding responses, based on the context of your prompts.`}
//                     <span className='font-semibold italic text-slate-500'> (optional)</span>
//                 </p>
//             </div>

//             <div className='flex items-center space-x-2'>
//                 <Switch id='enable-magic-variables'
//                     checked={nMagicVariables !== undefined}
//                     onCheckedChange={(checked) => {
//                         if (checked) {
//                             setNMagicVariables(1)
//                         } else {
//                             setNMagicVariables(undefined)
//                         }
//                     }}
//                 />
//                 <Label htmlFor='enable-magic-variables'>Enabled</Label>
//             </div>
//             <div className={cn("grid gap-2", nMagicVariables === undefined && "opacity-60")}>
//                 <Label htmlFor='experiment-magic-variable-variations'># of magic variable variations</Label>
//                 <Input
//                     required
//                     type='number'
//                     id='experiment-magic-variable-variations'
//                     value={(nMagicVariables !== undefined) ? "" + nMagicVariables : ""}
//                     disabled={nMagicVariables === undefined}
//                     onChange={(e) => setNMagicVariables(Math.max(1, parseInt(e.target.value)))}
//                 />
//             </div>

//             <div className='grid gap-2'>
//                 <Label className='inline-block'>Magic prompts</Label>
//                 <p className='text-sm text-slate-500'>
//                     {`Generate new prompts for you based on the context and intent of your existing prompts, with the goal of maximizing useful responses.`}
//                 </p>
//             </div>

//             <div className='flex items-center space-x-2'>
//                 <Switch
//                     id='enable-magic-prompts'
//                     checked={nMagicPrompts !== undefined}
//                     onCheckedChange={(checked) => {
//                         if (checked) {
//                             setNMagicPrompts(1)
//                         } else {
//                             setNMagicPrompts(undefined)
//                         }
//                     }}
//                 />
//                 <Label htmlFor='enable-magic-prompts'>Enabled</Label>
//             </div>
//             <div className={cn("grid gap-2", nMagicPrompts === undefined && "opacity-60")}>
//                 <Label htmlFor='experiment-magic-prompts'># of magic prompts</Label>
//                 <Input
//                     required
//                     type='number'
//                     id='experiment-magic-prompts'
//                     value={(nMagicPrompts !== undefined) ? "" + nMagicPrompts : ""}
//                     disabled={nMagicPrompts === undefined}
//                     onChange={(e) => setNMagicPrompts(Math.max(1, parseInt(e.target.value)))}
//                 />
//             </div>

//             <Button
//                 className='w-full'
//                 disabled={isCreateExperimentLoading}
//                 onClick={sendCreateExperiment}
//             >
//                 Submit
//                 <ArrowRight className='ml-2 h-4 w-4' />
//             </Button>
//         </div>
//     )
// }

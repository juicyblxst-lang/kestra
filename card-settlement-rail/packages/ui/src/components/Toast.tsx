import * as React from 'react';import {Toaster,toast as sonnerToast} from 'sonner';
export function Toast(props:React.ComponentProps<typeof Toaster>){return <Toaster richColors closeButton position="top-right" {...props}/>}
export const toast={success:sonnerToast.success,error:sonnerToast.error,info:sonnerToast.info,warning:sonnerToast.warning,loading:sonnerToast.loading,dismiss:sonnerToast.dismiss};

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "./ui/alert-dialog.tsx";

export const AlertDialogWrapper = ({children, open, title,  onOkText, onCloseText, description, onOkClick, onCancelClick}: any) => {

    return <AlertDialog open={open}>
        {children && <AlertDialogTrigger asChild>
            {children}
        </AlertDialogTrigger>}
        <AlertDialogContent>
            <AlertDialogHeader>
                {title && <AlertDialogTitle>{title}</AlertDialogTitle>}
                {description && <AlertDialogDescription>
                    {description}
                </AlertDialogDescription>}
            </AlertDialogHeader>
            {(onCancelClick || onOkClick) && <AlertDialogFooter className="items-center">
                {onCancelClick && <AlertDialogCancel className="w-full" onClick={onCancelClick}>{onCloseText || 'Cancel'}</AlertDialogCancel>}
                {onOkClick && <AlertDialogAction className="w-full" onClick={onOkClick}>{onOkText || 'Continue'}</AlertDialogAction>}
            </AlertDialogFooter>}
        </AlertDialogContent>
    </AlertDialog>
}
import IconBellBing from '@/components/icon/icon-bell-bing';

export default function FormErrors({errors, ...props}) {
    return errors.length > 0 && <div className="mb-5 grid gap-5">
        <div className="flex items-center rounded bg-info p-3.5 text-white">
            <span className="h-6 w-6 text-white ltr:mr-4 rtl:ml-4">
                <IconBellBing className="h-6 w-6" />
            </span>
            <span>
                <strong className="ltr:mr-1 rtl:ml-1">Ошибки при заполнении формы.</strong>Для отправки формы необходимо решить ошибки ввода.
            </span>
        </div>
        <div className="flex flex-col">
            {errors && errors.map(_ => <div>{_.name}: {_.message}</div>)}
        </div>
    </div>
}

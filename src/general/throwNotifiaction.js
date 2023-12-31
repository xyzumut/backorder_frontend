import { notification } from 'antd';


const throwNotification =  ({ message, description, type, duration }) => {

    if (duration === undefined) {
        duration = 5
    }
    switch (type) {
        case 'success':
            notification.success({
                description:description,
                message:message,
                placement:'bottomRight',
                duration:duration
            })
            break;
        case 'error':
            notification.error({
                description:description,
                message:message,
                placement:'bottomRight',
                duration:duration
            })
            break;
        case 'warning':
            notification.warning({
                description:description,
                message:message,
                placement:'bottomRight',
                duration:duration
            })
            break;
        default:
            notification.info({
                description:description,
                message:message,
                placement:'bottomRight',
                duration:duration
            })
            break;
    }
}
export default throwNotification;
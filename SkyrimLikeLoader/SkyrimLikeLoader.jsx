import React, {useEffect, useMemo} from 'react'
import { createPortal } from 'react-dom';
import './SkyrimLikeLoaderStyles.scss'

/**
 * Лоадер в стиле загрузочного экрана Skyrim
 * Автор не преследовал цель попасть точь-в-точь, просто повторить общее впечатление
 *
 * @param {boolean} willUnmount - запускает анимацию "удаления" лоадера
 * @param {() => void} canDelete - функция-триггер, которая сигнализирует, что визуально лоадер пропал
 * @param {string} text - Текст надписи справа снизу
 * @param {JSX.Element} image - изображение или любой элемент с изображением
 * @param {'img-half'|'img-full'} imageStyle - стиль изображения
 * @param {boolean} useLoadPercent - использовать индикатор прогресса
 * @param {number|null} percentValue - величина индикатора прогресса
 * @param {boolean} fullScreen - отвечает за вывод лоадера во весь экран
 * @returns {React.ReactPortal|JSX.Element}
 * @constructor
 */
export const SkyrimLikeLoader = ({
    willUnmount,
    canDelete,
    text = '',
    image = null,
    imageStyle = 'img-half',
    useLoadPercent = false,
    percentValue = null,
    fullScreen = true
}) => {
    const randomNumber = (max) => {
        return Math.floor(Math.random() * (max - 1 + 1) + 1)
    }

    const animationVersion = useMemo(() => {
        return `skl-animation-${randomNumber(4)}`;
    }, [])


    useEffect(() => {
        if(!willUnmount) return
        setTimeout(() => {
            canDelete()
        }, 2100)
    }, [willUnmount])


    if(useLoadPercent && !percentValue) {
        percentValue = useMemo(() => {
            return randomNumber(100)
        }, [])
    }

    if(percentValue && percentValue > 100) percentValue = 100;

    const loaderStyles = {width: `${percentValue}%`};

    const classNames = ['skyrimLikeLoader'];
    if(!fullScreen) classNames.push('skl-included')
    if(fullScreen) classNames.push('skl-fullscreen')
    if(willUnmount) classNames.push('skl-close')

    if(fullScreen) return createPortal(
        <div className={classNames.join(' ')}>
            {useLoadPercent &&
                (<div className={'skyrimLikeLoader_percentLoader'}>
                    <div className={'skyrimLikeLoader_percentLoader_body'}><div style={loaderStyles}></div></div>
                </div>)
            }
            {image && <div className={`skyrimLikeLoader_image ${imageStyle} ${animationVersion}`}>{image}</div>}
            <p>{text}</p>
        </div>,
        document.body
    )

    return <div className={classNames.join(' ')}>
        {useLoadPercent &&
            (<div className={'skyrimLikeLoader_percentLoader'}>
                <div className={'skyrimLikeLoader_percentLoader_body'}><div style={loaderStyles}></div></div>
            </div>)
        }
        {image && <div className={`skyrimLikeLoader_image ${imageStyle} ${animationVersion}`}>{image}</div>}
        <p>{text}</p>
    </div>
}
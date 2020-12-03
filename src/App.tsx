import React from 'react'
import {hot} from 'react-hot-loader'
import './App.scss'
import { Card } from './components/card/card'

enum CardState {
  READY = 'Ready: 3, 2, 1, 👏',
  THREE = '3...',
  TWO = '2...',
  ONE = '1...',
  Clap = `👏`,
  Rest = 'Click to start countdown',
}

function App() {
  const [cardContent, setCardContent] = React.useState(CardState.Rest)
  const [percentageWiped, setPercentageWiped] = React.useState(0)
  const [flash, setFlash] = React.useState(false)

  const resetCard = () => {
    setCardContent(CardState.Rest)
    setPercentageWiped(0)
    setFlash(false)
  }

  const incrementDateTo = ({date, second, minute}: {date: Date, second: number, minute?: number}) => (
    new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDay() - 1,
      date.getHours(),
      minute ?? date.getMinutes(),
      second,
      0,
    )
  )

  const calculateEndTimes = (date: Date, endSecond: number) => ({
    readyTime: incrementDateTo({date, second: endSecond - 4}),
    threeTime: incrementDateTo({date, second: endSecond - 3}),
    twoTime: incrementDateTo({date, second: endSecond - 2}),
    oneTime: incrementDateTo({date, second: endSecond - 1}),
    clapTime: incrementDateTo({
      date,
      second: endSecond === 60 ? 0 : endSecond,
      minute: endSecond === 60 ? date.getMinutes() + 1 : undefined
    }),
  })

  const getPercentageToAnimate = (callback: (percentage: number) => void) => {
    const timeStart = new Date()

    const seconds = timeStart.getSeconds()
    let endTimes: {readyTime: Date, threeTime: Date, twoTime: Date, oneTime: Date, clapTime: Date}
    if (seconds < 11) {
      endTimes = calculateEndTimes(timeStart, 15)
    } else if (seconds < 26) {
      endTimes = calculateEndTimes(timeStart, 30)
    } else if (seconds < 41) {
      endTimes = calculateEndTimes(timeStart, 45)
    } else {
      endTimes = calculateEndTimes(timeStart, 60)
    }

    const runClapSync = () => {
      const currentTime = new Date().getTime()

      if (currentTime < endTimes.threeTime.getTime()) {
        setCardContent(CardState.READY)
        const percentageDone = (currentTime - timeStart.getTime()) / (endTimes.threeTime.getTime() - timeStart.getTime())
        const percentageToAnimate = Math.min(percentageDone, 1)
        callback(percentageToAnimate)
        window.requestAnimationFrame(runClapSync)
      } else if (currentTime < endTimes.twoTime.getTime()) {
        setCardContent(CardState.THREE)
        const percentageDone = 1 - (endTimes.twoTime.getTime() - currentTime) / 1000
        const percentageToAnimate = Math.min(percentageDone, 1)
        callback(percentageToAnimate)
        window.requestAnimationFrame(runClapSync)
      } else if (currentTime < endTimes.oneTime.getTime()) {
        setCardContent(CardState.TWO)
        const percentageDone = 1 - (endTimes.oneTime.getTime() - currentTime) / 1000
        const percentageToAnimate = Math.min(percentageDone, 1)
        callback(percentageToAnimate)
        window.requestAnimationFrame(runClapSync)
      } else if (currentTime < endTimes.clapTime.getTime()) {
        setCardContent(CardState.ONE)
        const percentageDone = 1 - (endTimes.clapTime.getTime() - currentTime) / 1000
        const percentageToAnimate = Math.min(percentageDone, 1)
        callback(percentageToAnimate)
        window.requestAnimationFrame(runClapSync)
      } else {
        setFlash(true)
        setCardContent(CardState.Clap)
        setTimeout(() => {resetCard()}, 250)
      }
    }

    window.requestAnimationFrame(runClapSync)
  }

  const onClick = () => {
    getPercentageToAnimate(setPercentageWiped)
  }

  return(
    <div className="app" onClick={onClick}>
      <Card content={cardContent} percentageWiped={percentageWiped} flash={flash}/>
      {!flash && (
        <div className="byline">
          © 2020 <a onClick={e => e.stopPropagation()} href="https://ksekhri.com">Karan Sekhri</a> — <a onClick={e => e.stopPropagation()} href="https://github.com/ksekhri/clapsync">Source</a>
        </div>
      )}
    </div>
  );
}

export default hot(module)(App);

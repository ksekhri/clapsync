import React from 'react'
import {hot} from 'react-hot-loader'
import './App.scss'
import { Card } from './components/card/card'

enum CardState {
  READY = 'Get ready... (3, 2, 1, 👏)',
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
  const [isRunning, setIsRunning] = React.useState(false)

  const resetCard = () => {
    setCardContent(CardState.Rest)
    setPercentageWiped(0)
    setFlash(false)
    setIsRunning(false)
  }

  const incrementDateTo = ({startTime, second, minute}: {startTime: Date, second: number, minute?: number}) => (
    new Date(
      startTime.getFullYear(),
      startTime.getMonth(),
      startTime.getDate(),
      startTime.getHours(),
      minute ?? startTime.getMinutes(),
      second,
      0,
    )
  )

  const calculateEndTimes = (startTime: Date, endSecond: number) => ({
    threeTime: incrementDateTo({startTime, second: endSecond - 3}),
    twoTime: incrementDateTo({startTime, second: endSecond - 2}),
    oneTime: incrementDateTo({startTime, second: endSecond - 1}),
    clapTime: incrementDateTo({startTime, second: endSecond }),
  })

  const runClapSync = (callback: (percentage: number) => void) => {
    setIsRunning(true)
    const startTime = new Date()

    const seconds = startTime.getSeconds()
    let endTimes: {threeTime: Date, twoTime: Date, oneTime: Date, clapTime: Date}
    if (seconds < 11) {
      endTimes = calculateEndTimes(startTime, 15)
    } else if (seconds < 26) {
      endTimes = calculateEndTimes(startTime, 30)
    } else if (seconds < 41) {
      endTimes = calculateEndTimes(startTime, 45)
    } else if (seconds < 56) {
      endTimes = {
        threeTime: incrementDateTo({startTime, second: 57}),
        twoTime: incrementDateTo({startTime, second: 58}),
        oneTime: incrementDateTo({startTime, second: 59}),
        clapTime: incrementDateTo({startTime, second: 0, minute: startTime.getMinutes() + 1 }),
      }
    } else {
      const minute = startTime.getMinutes() + 1
      endTimes = {
        threeTime: incrementDateTo({startTime, second: 12, minute }),
        twoTime: incrementDateTo({startTime, second: 13, minute }),
        oneTime: incrementDateTo({startTime, second: 14, minute }),
        clapTime: incrementDateTo({startTime, second: 15, minute }),
      }
    }

    const incrementClapSync = () => {
      const currentTime = new Date().getTime()

      if (currentTime < endTimes.threeTime.getTime()) {
        setCardContent(CardState.READY)
        const percentageDone = (currentTime - startTime.getTime()) / (endTimes.threeTime.getTime() - startTime.getTime())
        const percentageToAnimate = Math.min(percentageDone, 1)
        callback(percentageToAnimate)
        window.requestAnimationFrame(incrementClapSync)
      } else if (currentTime < endTimes.twoTime.getTime()) {
        setCardContent(CardState.THREE)
        const percentageDone = 1 - (endTimes.twoTime.getTime() - currentTime) / 1000
        const percentageToAnimate = Math.min(percentageDone, 1)
        callback(percentageToAnimate)
        window.requestAnimationFrame(incrementClapSync)
      } else if (currentTime < endTimes.oneTime.getTime()) {
        setCardContent(CardState.TWO)
        const percentageDone = 1 - (endTimes.oneTime.getTime() - currentTime) / 1000
        const percentageToAnimate = Math.min(percentageDone, 1)
        callback(percentageToAnimate)
        window.requestAnimationFrame(incrementClapSync)
      } else if (currentTime < endTimes.clapTime.getTime()) {
        setCardContent(CardState.ONE)
        const percentageDone = 1 - (endTimes.clapTime.getTime() - currentTime) / 1000
        const percentageToAnimate = Math.min(percentageDone, 1)
        callback(percentageToAnimate)
        window.requestAnimationFrame(incrementClapSync)
      } else {
        setFlash(true)
        setCardContent(CardState.Clap)
        setTimeout(() => {resetCard()}, 250)
      }
    }

    window.requestAnimationFrame(incrementClapSync)
  }

  const onClick = () => {
    !isRunning && runClapSync(setPercentageWiped)
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

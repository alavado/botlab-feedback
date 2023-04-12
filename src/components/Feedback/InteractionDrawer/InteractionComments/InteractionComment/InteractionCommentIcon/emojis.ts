import happyEmojiImage from '../../../../../../assets/images/emojis/happy.png'
import patienceEmojiImage from '../../../../../../assets/images/emojis/patience.png'
import sleepingEmojiImage from '../../../../../../assets/images/emojis/sleeping.png'
import okEmojiImage from '../../../../../../assets/images/emojis/ok.png'
import notOkEmojiImage from '../../../../../../assets/images/emojis/not_ok.png'
import checkEmojiImage from '../../../../../../assets/images/emojis/check.png'
import crossEmojiImage from '../../../../../../assets/images/emojis/cross.png'
import repeatEmojiImage from '../../../../../../assets/images/emojis/repeat.png'
import waitEmojiImage from '../../../../../../assets/images/emojis/wait.png'
import lookEmojiImage from '../../../../../../assets/images/emojis/look.png'
import circleRedEmojiImage from '../../../../../../assets/images/emojis/circle_red.png'
import circleOrangeEmojiImage from '../../../../../../assets/images/emojis/circle_orange.png'
import circleYellowEmojiImage from '../../../../../../assets/images/emojis/circle_yellow.png'
import circleGreenEmojiImage from '../../../../../../assets/images/emojis/circle_green.png'
import circleBlueEmojiImage from '../../../../../../assets/images/emojis/circle_blue.png'
import circleVioletEmojiImage from '../../../../../../assets/images/emojis/circle_violet.png'
import circleBrownEmojiImage from '../../../../../../assets/images/emojis/circle_brown.png'
import circleBlackEmojiImage from '../../../../../../assets/images/emojis/circle_black.png'
import circleWhiteEmojiImage from '../../../../../../assets/images/emojis/circle_white.png'

type EmojiIconData = {
  icon: string
  altText: string
}

export const emojiMap = {
  '✅': {
    icon: checkEmojiImage,
    altText: 'OK',
  },
  '❌': {
    icon: crossEmojiImage,
    altText: 'Cruz',
  },
  '🔁': {
    icon: repeatEmojiImage,
    altText: 'Repetir',
  },
  '⏳': {
    icon: waitEmojiImage,
    altText: 'En espera',
  },
  '👀': {
    icon: lookEmojiImage,
    altText: 'Echando un vistazo',
  },
  '😊': {
    icon: happyEmojiImage,
    altText: 'Feliz',
  },
  '🙄': {
    icon: patienceEmojiImage,
    altText: 'Paciencia',
  },
  '😴': {
    icon: sleepingEmojiImage,
    altText: 'Durmiendo',
  },
  '👍': {
    icon: okEmojiImage,
    altText: 'Bien',
  },
  '👎': {
    icon: notOkEmojiImage,
    altText: 'Mal',
  },
  '🔴': {
    icon: circleRedEmojiImage,
    altText: 'Círculo rojo',
  },
  '🟠': {
    icon: circleOrangeEmojiImage,
    altText: 'Círculo naranja',
  },
  '🟡': {
    icon: circleYellowEmojiImage,
    altText: 'Círculo amarillo',
  },
  '🟢': {
    icon: circleGreenEmojiImage,
    altText: 'Círculo verde',
  },
  '🔵': {
    icon: circleBlueEmojiImage,
    altText: 'Círculo azul',
  },
  '🟣': {
    icon: circleVioletEmojiImage,
    altText: 'Círculo violeta',
  },
  '🟤': {
    icon: circleBrownEmojiImage,
    altText: 'Círculo café',
  },
  '⚫': {
    icon: circleBlackEmojiImage,
    altText: 'Círculo negro',
  },
  '⚪': {
    icon: circleWhiteEmojiImage,
    altText: 'Círculo blanco',
  },
}

export type Emoji = keyof typeof emojiMap

export const emojiToIconData = (emoji: Emoji): EmojiIconData => {
  return emojiMap[emoji]
}

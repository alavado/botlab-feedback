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
    disabled: false,
  },
  '❌': {
    icon: crossEmojiImage,
    altText: 'Cruz',
    disabled: false,
  },
  '🔁': {
    icon: repeatEmojiImage,
    altText: 'Repetir',
    disabled: false,
  },
  '⏳': {
    icon: waitEmojiImage,
    altText: 'En espera',
    disabled: false,
  },
  '👀': {
    icon: lookEmojiImage,
    altText: 'Echando un vistazo',
    disabled: false,
  },
  '😊': {
    icon: happyEmojiImage,
    altText: 'Feliz',
    disabled: false,
  },
  '🙄': {
    icon: patienceEmojiImage,
    altText: 'Paciencia',
    disabled: true,
  },
  '😴': {
    icon: sleepingEmojiImage,
    altText: 'Durmiendo',
    disabled: false
  },
  '👍': {
    icon: okEmojiImage,
    altText: 'Bien',
    disabled: false
  },
  '👎': {
    icon: notOkEmojiImage,
    altText: 'Mal',
    disabled: false
  },
  '🔴': {
    icon: circleRedEmojiImage,
    altText: 'Círculo rojo',
    disabled: false
  },
  '🟠': {
    icon: circleOrangeEmojiImage,
    altText: 'Círculo naranja',
    disabled: false
  },
  '🟡': {
    icon: circleYellowEmojiImage,
    altText: 'Círculo amarillo',
    disabled: false
  },
  '🟢': {
    icon: circleGreenEmojiImage,
    altText: 'Círculo verde',
    disabled: false
  },
  '🔵': {
    icon: circleBlueEmojiImage,
    altText: 'Círculo azul',
    disabled: false
  },
  '🟣': {
    icon: circleVioletEmojiImage,
    altText: 'Círculo violeta',
    disabled: true,
  },
  '🟤': {
    icon: circleBrownEmojiImage,
    altText: 'Círculo café',
    disabled: true,
  },
  '⚫': {
    icon: circleBlackEmojiImage,
    altText: 'Círculo negro',
    disabled: true,
  },
  '⚪': {
    icon: circleWhiteEmojiImage,
    altText: 'Círculo blanco',
    disabled: true,
  },
}

export type Emoji = keyof typeof emojiMap

export const emojiToIconData = (emoji: Emoji): EmojiIconData => {
  return emojiMap[emoji]
}

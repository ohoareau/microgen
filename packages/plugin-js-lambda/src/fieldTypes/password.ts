export default () => ({
    type: 'string',
    validators: [
        {type: '@maxLength', config: {max: 64}},
        {type: '@minLength', config: {min: 8}},
        {type: '@hasUpperLetter'},
        {type: '@hasLowerLetter'},
        {type: '@hasDigit'},
        {type: '@hasSpecialChar'},
    ],
    transform: {type: '@password', config: {rounds: 10}}
})
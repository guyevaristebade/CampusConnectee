export const passwordValidators = (password : string) => [
    {
        validator: password !== undefined,
        message: 'Mot de passe necéssaire',
    },
    {
        validator: password?.length >= 8,
        message: 'Le mot de passe doit contenir au moins 8 caractères',
    },
    {
        validator: /[a-z]/g.test(password),
        message: 'Le mot de passe doit contenir au moins 1 caractère minuscule',
    },
    {
        validator: /[A-Z]/g.test(password),
        message: 'Le mot de passe doit contenir au moins 1 caractère majuscule',
    },
    {
        validator: /[0-9]/g.test(password),
        message: 'Le mot de passe doit contenir au moins 1 caractère numérique',
    },
    {
        validator: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g.test(password),
        message: 'Le mot de passe doit contenir au moins 1 caractère spécial : !@#$%^&*()_+-=[]{};/?',
    },
]

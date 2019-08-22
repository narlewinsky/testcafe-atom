'use babel';


export const testCafeRunnerSettings = {
    'testCafeOptions': {
        'title': 'Specific TestCafe options',
        'description': 'Used to configure specific TestCafe options.',
        'type': 'object',

        'properties': {
            'browsers': {
                'title': 'Browsers',
                'description': 'Specifies the list of browsers where tests are run.',
                'type': 'array',
                'default': ['chrome'],
                'items': {
                    'type': 'string'
                }
            },

            'hostname': {
                'title': 'Hostname',
                'description': 'Specifies your computer`s hostname. It is used when running tests in remote browsers.',
                'type': 'string',
                'default': 'localhost'
            },

            'ports': {
                'title': 'Ports',
                'description': 'Specifies custom port numbers TestCafe uses to perform testing.',
                'type': 'array',
                'default': ['1488', '1489'],
                'items': {
                    'type': 'string'
                }
            },

            'thisLiveMode': {
                'title': 'Used for TestCafe live mode',
                'description': 'Watches for changes you make in the test files and all files referenced in them.',
                'type': 'boolean',
                'default': false
            }
        }
    },

    'terminalFont': {
        'title': 'Terminal Font Style',
        'description': 'Сhanges the display style of text in the terminal.',
        'type': 'object',

        'properties': {
            'fontFamily': {
                'title': 'Font Family',
                'description': 'List of font-family used for terminal panel text.',
                'type': 'string',
                'default': 'monospace',
                'items': {
                    'type': 'string'
                }
            },
            'fontSize': {
                'title': 'Font Size',
                'description': 'Height in pixels of terminal panel text.',
                'type': 'number',
                'default': 13
            },
        }
    },

    'terminalPalette': {
        'title': 'Terminal Palette',
        'description': 'Used for terminal colors customization',
        'type': 'object',

        'properties': {
            'background': {
                'title': 'Background',
                'type': 'color',
                'default': '#21252b'
            },

            'foreground': {
                'title': 'Foreground',
                'type': 'color',
                'default': '#9da5b4'
            },

            'cursor': {
                'title': 'Cursor',
                'type': 'color',
                'default': '#9da5b4'
            },

            'cursorAccent': {
                'title': 'Cursor Accent',
                'type': 'color',
                'default': '#9da5b4'
            },
        },
    }
}

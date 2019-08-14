'use babel';

export const testcafeRunnerConfig = {
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
    'testInLiveMode': {
        'title': 'TestCafe in live mode',
        'description': 'Watches for changes you make in the test files and all files referenced in them',
        'type': 'boolean',
        'default': false
    },
    'fontFamily': {
        'title': 'Font Family',
        'description': 'The name of the font family used for TextCafe output panel text.',
        'type': 'string',
        'default': 'monospace',
        'items': {
            'type': 'string'
        }
    },
    'fontSize': {
        'title': 'Font Size',
        'description': 'Height in pixels of TestCafe output panel text.',
        'type': 'number',
        'default': 13
    },
    'colorScheme': {
        'title': 'Color Scheme',
        'description': 'Color settings of output',
        'type': 'object',
        'properties': {
            'backgroundColor': {
                'title': 'Background',
                'type': 'color',
                'default': '#21252b'
            },
            'foregroundColor': {
                'title': 'Foreground',
                'type': 'color',
                'default': '#9da5b4'
            }
        }
    }
}

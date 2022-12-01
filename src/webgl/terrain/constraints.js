let i = 0

const matches = {
	'1': ['1', '2', '3', '4'],
	'2': ['1', '2'],
	'3': ['1', '4'],
	'4': ['1', '3']
}
// 4 type of profile match :
// 1 -> empty
// 2 -> full
// 3 -> half right
// 4 -> half-left

const base = [
	{
		name: 'empty',
		index: i++,
		weight: 2,
		rotation: 0,
		profiles: {
			posX: '1',
			negX: '1',
			posY: '1',
			negY: '1',
			posZ: '1',
			negZ: '1'
		}
	},
	{
		name: 'full',
		index: i++,
		weight: 50,
		rotation: 0,
		profiles: {
			posX: '2',
			negX: '2',
			posY: '2',
			negY: '2',
			posZ: '2',
			negZ: '2'
		}
	},
	{
		name: 'half',
		index: i++,
		weight: 1,
		rotation: 0,
		profiles: {
			posX: '2',
			negX: '1',
			posY: 'e',
			negY: 'e',
			posZ: '3',
			negZ: '4'
		}
	},
	{
		name: 'quarter',
		index: i++,
		weight: 1,
		rotation: 0,
		profiles: {
			posX: '3',
			negX: '1',
			posY: 'e',
			negY: 'e',
			posZ: '1',
			negZ: '4'
		}
	},
	{
		name: 'quarter_empty',
		index: i++,
		weight: 1,
		rotation: 0,
		profiles: {
			posX: '4',
			negX: '2',
			posY: 'e',
			negY: 'e',
			posZ: '2',
			negZ: '3'
		}
	},
]

function computeRotation(arr) {
	const f = [...arr]
	arr.forEach(s => {
		f.push({
			name: s.name,
			index: i++,
			weight: s.weight,
			rotation: 1,
			profiles: {
				posX: s.profiles.posZ,
				negX: s.profiles.negZ,
				posY: s.profiles.posY,
				negY: s.profiles.negY,
				posZ: s.profiles.negX,
				negZ: s.profiles.posX
			}
		})
		f.push({
			name: s.name,
			index: i++,
			weight: s.weight,
			rotation: 2,
			profiles: {
				posX: s.profiles.negX,
				negX: s.profiles.posX,
				posY: s.profiles.posY,
				negY: s.profiles.negY,
				posZ: s.profiles.negZ,
				negZ: s.profiles.posZ
			}
		})
		f.push({
			name: s.name,
			index: i++,
			weight: s.weight,
			rotation: 3,
			profiles: {
				posX: s.profiles.negZ,
				negX: s.profiles.posZ,
				posY: s.profiles.posY,
				negY: s.profiles.negY,
				posZ: s.profiles.posX,
				negZ: s.profiles.negX
			}
		})
	})
	return f
}
const constraints = computeRotation(base)
export {
	constraints,
	matches
}
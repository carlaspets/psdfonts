require 'bindata/base_primitive'

module BinData
  # Defines a number of classes that contain a bit based integer.
  # The integer is defined by endian and number of bits.

  module BitField #:nodoc: all
    class << self
      def define_class(nbits, endian)
        name = "Bit#{nbits}"
        name << "le" if endian == :little
        unless BinData.const_defined?(name)
          BinData.module_eval <<-END
            class #{name} < BinData::BasePrimitive
              BitField.define_methods(self, #{nbits}, :#{endian})
            end
          END
        end

        BinData.const_get(name)
      end

      def define_methods(bit_class, nbits, endian)
        bit_class.module_eval <<-END
          def assign(val)
            #{create_clamp_code(nbits)}
            super(val)
          end

          def do_write(io)
            io.writebits(_value, #{nbits}, :#{endian})
          end

          def do_num_bytes
            #{nbits / 8.0}
          end

          #---------------
          private

          def read_and_return_value(io)
            io.readbits(#{nbits}, :#{endian})
          end

          def sensible_default
            0
          end
        END
      end

      def create_clamp_code(nbits)
        min = 0
        max = (1 << nbits) - 1
        clamp = "(val < #{min}) ? #{min} : (val > #{max}) ? #{max} : val"

        if nbits == 1
          # allow single bits to be used as booleans
          clamp = "(val == true) ? 1 : (not val) ? 0 : #{clamp}"
        end

        "val = #{clamp}"
      end
    end
  end

  # Create classes on demand
  module BitFieldFactory
    def const_missing(name)
      mappings = {
        /^Bit(\d+)$/ => :big,
        /^Bit(\d+)le$/ => :little
      }

      mappings.each_pair do |regex, endian|
        if regex =~ name.to_s
          nbits = $1.to_i
          return BitField.define_class(nbits, endian)
        end
      end

      super(name)
    end
  end
  BinData.extend BitFieldFactory
end
